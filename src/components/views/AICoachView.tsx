import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { aiService } from '../../services/aiService';
import { storageService } from '../../services/storageService';
import {
  CoachConversation,
  CoachMessage,
  CoachPersona,
  GeminiModelId,
  ArtDirectionAnalysis,
  ArtDirectorCritique,
} from '../../types';
import {
  Sparkles,
  Send,
  Loader2,
  Trash2,
  Paperclip,
  Image as ImageIcon,
  Palette,
  ScanEye,
  FileText,
  Copy,
  Check,
  ExternalLink,
  Crown,
  GraduationCap,
  Briefcase,
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sliders,
  Wand2,
  Video,
  Search,
  RefreshCw,
  Layers,
  Compass,
  MessageSquare,
  Lightbulb,
  Split,
  Bot,
  Film,
  ShieldCheck,
  FolderPlus,
  Eye,
  Eraser,
  Upload,
  Zap,
} from 'lucide-react';

export const AICoachView: React.FC = () => {
  const {
    language,
    activeProject,
    userProfile,
    showToast,
    addXP,
    setActiveSection,
    setCritiqueSampleImage,
    addProjectVersion,
    addPortfolioItem,
  } = useApp();

  // Active Main Tab: 'workflow' | 'audit' | 'media' | 'chat'
  const [activeTab, setActiveTab] = useState<'workflow' | 'audit' | 'media' | 'chat'>('media');

  // ==========================================
  // 1. STEP-BY-STEP BRIEF WORKFLOW (A TO Z)
  // ==========================================
  const [briefInput, setBriefInput] = useState('');
  const [briefClient, setBriefClient] = useState('');
  const [briefIndustry, setBriefIndustry] = useState('Branding & Commercial');
  const [briefPlatform, setBriefPlatform] = useState('Instagram & Digital Media');
  const [briefAudience, setBriefAudience] = useState('');
  const [briefLoading, setBriefLoading] = useState(false);
  const [briefAnalysis, setBriefAnalysis] = useState<ArtDirectionAnalysis | null>(null);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  // Moodboard collection & review
  const [moodboardLinks, setMoodboardLinks] = useState<Array<{ id: string; url: string; note: string }>>([
    { id: 'mb-1', url: 'https://behance.net/search/projects/luxury-branding', note: 'توزيع الكتل والمساحات البيضاء' },
  ]);
  const [newMoodboardLink, setNewMoodboardLink] = useState('');
  const [newMoodboardNote, setNewMoodboardNote] = useState('');
  const [moodboardReviewResult, setMoodboardReviewResult] = useState<string | null>(null);
  const [moodboardReviewLoading, setMoodboardReviewLoading] = useState(false);

  // ==========================================
  // 2. RIGHT VS. WRONG MEDIA AUDIT (IMAGES & VIDEOS)
  // ==========================================
  const [auditMediaType, setAuditMediaType] = useState<'image' | 'video'>('image');
  const [auditMedia, setAuditMedia] = useState<string | null>(null);
  const [auditMediaMime, setAuditMediaMime] = useState<string>('image/png');
  const [auditDescription, setAuditDescription] = useState('');
  const [auditGoal, setAuditGoal] = useState('');
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<ArtDirectorCritique | null>(null);
  const auditFileInputRef = useRef<HTMLInputElement>(null);

  // ==========================================
  // 3. POWER MODELS GENERATIVE STUDIO (PROMPT + REFERENCE IMAGE)
  // ==========================================
  const [mediaMode, setMediaMode] = useState<'image' | 'video'>('image');
  const [imagePrompt, setImagePrompt] = useState('تصميم إعلان عطر فاخر على قاعدة رخامية داكنة مع إضاءة سينمائية ذهبية ناعمة');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [referenceMime, setReferenceMime] = useState<string>('image/png');
  const [referenceMode, setReferenceMode] = useState<'style' | 'composition' | 'subject'>('style');
  const [referenceAnalysis, setReferenceAnalysis] = useState<any | null>(null);
  const [selectedPowerModel, setSelectedPowerModel] = useState<string>('gemini-nano-banana-2.1');
  const [stylePreset, setStylePreset] = useState<string>('luxury_minimal');
  const [enhancePromptWithAI, setEnhancePromptWithAI] = useState(true);
  const [imageAspectRatio, setImageAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3' | '3:4'>('1:1');
  const [imageLoading, setImageLoading] = useState(false);
  const [cleaningWatermark, setCleaningWatermark] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    '/assets/aistudio/Noor_Design_Artwork_1792489513455_cd1ff162.png'
  );
  const [generatedPromptUsed, setGeneratedPromptUsed] = useState<string | null>(
    'تصميم إعلان عطر فاخر على قاعدة رخامية داكنة مع إضاءة سينمائية ذهبية ناعمة (نسخة نقية 100% بدون أي علامات مائية)'
  );
  const [modelUsedResult, setModelUsedResult] = useState<string | null>('Nano Banana 2.1 Studio Engine (Watermark-Free HD)');
  const [activeFilter, setActiveFilter] = useState<'normal' | 'cinematic' | 'luxury_gold' | 'cyber_neon' | 'noir_bw'>('normal');
  const referenceFileInputRef = useRef<HTMLInputElement>(null);
  const watermarkFileInputRef = useRef<HTMLInputElement>(null);

  // Veo Video Generation State
  const [videoPrompt, setVideoPrompt] = useState('');
  const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16'>('9:16');
  const [sourceImageForVideo, setSourceImageForVideo] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoStatusMessage, setVideoStatusMessage] = useState('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  // ==========================================
  // 4. MULTI-TURN CONVERSATIONAL CHATBOT (CHATGPT 4O STYLE)
  // ==========================================
  const [conversations, setConversations] = useState<CoachConversation[]>(() =>
    storageService.getConversations()
  );
  const [activeConvId, setActiveConvId] = useState<string>(() => {
    const list = storageService.getConversations();
    return list[0]?.id || 'conv-1';
  });
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatAttachedMedia, setChatAttachedMedia] = useState<string | null>(null);
  const [chatAttachedMediaType, setChatAttachedMediaType] = useState<'image' | 'video'>('image');
  const [persona, setPersona] = useState<CoachPersona>('chatgpt_style');
  const [selectedChatModel, setSelectedChatModel] = useState<GeminiModelId>('chatgpt-4o');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const chatFileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages, chatLoading]);

  // Helpers
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(language === 'ar' ? 'تم النسخ إلى الحافظة' : 'Copied to clipboard', 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const updateActiveConversationMessages = (msgs: CoachMessage[]) => {
    const updated = conversations.map((c) =>
      c.id === activeConvId ? { ...c, messages: msgs } : c
    );
    setConversations(updated);
    storageService.saveConversations(updated);
  };

  const handleNewConversation = () => {
    const newConv: CoachConversation = {
      id: `conv-${Date.now()}`,
      title: language === 'ar' ? `محادثة جديدة ${conversations.length + 1}` : `Chat ${conversations.length + 1}`,
      createdAt: new Date().toISOString(),
      persona,
      model: selectedChatModel,
      messages: [
        {
          id: `msg-welcome-${Date.now()}`,
          role: 'assistant',
          content:
            language === 'ar'
              ? `أهلاً يا ${userProfile.name || 'نور'}! أنا معك زي شات جي بي تي بالذكاء الاصطناعي لمساعدتك في كل خطوة بتصميمك. اسألني عن أي فكرة، اطلب اقتراحات ألوان أو خطوط، شاركني مسودة تصميمك، أو قولي "إيه رأيك؟ صح ولا غلط؟" وهجاوبك فوراً وبأعلى احترافية!`
              : `Hello ${userProfile.name || 'Noor'}! I am your AI Design Partner, like ChatGPT. Ask me any design question, request color palettes or copy, share your draft, and let's create together!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };
    const updated = [newConv, ...conversations];
    setConversations(updated);
    setActiveConvId(newConv.id);
    storageService.saveConversations(updated);
  };

  // 1. Brief Analysis Run
  const handleRunBriefDeconstruction = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!briefInput.trim() && !activeProject) {
      showToast(language === 'ar' ? 'يرجى كتابة البريف أو اختيار مشروع نشط' : 'Please provide a brief', 'warning');
      return;
    }

    setBriefLoading(true);
    try {
      const result = await aiService.deconstructBrief({
        brief: briefInput.trim() || activeProject?.description || activeProject?.title || 'تصميم هوية بصرية تجارية متكاملة',
        clientName: briefClient || activeProject?.clientName,
        industry: briefIndustry || activeProject?.industry,
        platform: briefPlatform,
        audience: briefAudience,
        language,
      });

      setBriefAnalysis(result);
      setActiveWorkflowStep(1);
      addXP(150, 'تفكيك البريف والتخطيط الإبداعي');
      showToast(language === 'ar' ? 'تم تشريح البريف وتوليد خطة التنفيذ من الألف إلى الياء!' : 'Brief analyzed successfully!', 'success');
    } catch (err: any) {
      showToast(language === 'ar' ? 'فشل تحليل البريف' : 'Brief analysis failed', 'error');
    } finally {
      setBriefLoading(false);
    }
  };

  const handleLoadActiveProject = () => {
    if (!activeProject) {
      showToast(language === 'ar' ? 'لا يوجد مشروع نشط حالياً' : 'No active project found', 'info');
      return;
    }
    setBriefInput(activeProject.description || activeProject.title);
    setBriefClient(activeProject.clientName);
    setBriefIndustry(activeProject.industry);
    showToast(language === 'ar' ? `تم استيراد بيانات: ${activeProject.title}` : 'Imported active project data', 'success');
  };

  // Moodboard review
  const handleReviewMoodboard = async () => {
    if (moodboardLinks.length === 0) {
      showToast(language === 'ar' ? 'أضف رابطاً أو فكرة واحدة على الأقل' : 'Add at least one idea', 'warning');
      return;
    }

    setMoodboardReviewLoading(true);
    try {
      const prompt = `As the Senior Art Director for Noor, review these moodboard inspiration ideas/links for this brief:
Brief: ${briefInput || 'Commercial branding project'}
Moodboard Ideas Collected by Noor:
${moodboardLinks.map((m, i) => `${i + 1}. Note: ${m.note} | Link: ${m.url}`).join('\n')}
Evaluate what is RIGHT to adopt, what to AVOID, and how to combine them into an original world-class visual identity.
Language: Arabic.`;

      const feedback = await aiService.answerDesignQuestion({
        messages: [{ role: 'user', content: prompt }],
        persona: 'strict_art_director',
        model: 'gemini-3.8-flash',
        language,
      });

      setMoodboardReviewResult(feedback);
      showToast(language === 'ar' ? 'اكتمل تقييم الآرت ديركتور للمودبورد!' : 'Moodboard review ready!', 'success');
    } catch (err: any) {
      showToast(language === 'ar' ? 'تعذر مراجعة المودبورد' : 'Review failed', 'error');
    } finally {
      setMoodboardReviewLoading(false);
    }
  };

  // 2. Right vs. Wrong Media Audit (Image / Video)
  const handleAuditMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVid = file.type.startsWith('video/');
      setAuditMediaType(isVid ? 'video' : 'image');
      setAuditMediaMime(file.type || (isVid ? 'video/mp4' : 'image/png'));

      const reader = new FileReader();
      reader.onload = (event) => {
        setAuditMedia(event.target?.result as string);
        setAuditResult(null);
        showToast(
          language === 'ar'
            ? `تم تحميل ${isVid ? 'فيديو الموشن' : 'مسودة التصميم'} لفحص الآرت ديركتور!`
            : `Loaded ${isVid ? 'video' : 'image'} for audit!`,
          'info'
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunRightWrongAudit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!auditMedia && !auditDescription.trim()) {
      showToast(language === 'ar' ? 'يرجى رفع تصميم/فيديو أو كتابة وصف التكوين' : 'Provide media or description', 'warning');
      return;
    }

    setAuditLoading(true);
    try {
      const res = await aiService.auditDesignRightWrong({
        imageData: auditMedia || undefined,
        mediaData: auditMedia || undefined,
        imageMimeType: auditMediaMime,
        mediaMimeType: auditMediaMime,
        mediaType: auditMediaType,
        description: auditDescription,
        briefGoal: auditGoal || activeProject?.title,
        language,
      });

      setAuditResult(res);
      addXP(160, 'فحص صح وغلط للعمل الفني');
      showToast(language === 'ar' ? 'اكتمل فحص الآرت ديركتور (صح وغلط)!' : 'Audit complete!', 'success');
    } catch (err: any) {
      showToast(language === 'ar' ? 'تعذر إجراء الفحص' : 'Audit failed', 'error');
    } finally {
      setAuditLoading(false);
    }
  };

  // 3. Power Models Image Generation with Prompt + Reference Image
  const handleReferenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReferenceMime(file.type || 'image/png');
      const reader = new FileReader();
      reader.onload = (event) => {
        setReferenceImage(event.target?.result as string);
        showToast(language === 'ar' ? 'تم تحميل الصورة المرجعية (Reference) بنجاح!' : 'Reference image loaded!', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePrompt.trim() && !referenceImage) {
      showToast(language === 'ar' ? 'يرجى كتابة موجه الصورة أو رفع صورة مرجعية' : 'Please enter prompt or reference', 'warning');
      return;
    }

    setImageLoading(true);
    setGeneratedImageUrl(null);
    setReferenceAnalysis(null);
    try {
      const res = await aiService.generateImage({
        prompt: imagePrompt,
        referenceImage: referenceImage || undefined,
        referenceMimeType: referenceMime,
        referenceMode,
        aspectRatio: imageAspectRatio,
        imageSize,
        modelPreference: selectedPowerModel,
        stylePreset,
        enhancePrompt: enhancePromptWithAI,
        language,
      });

      setGeneratedImageUrl(res.imageUrl);
      setGeneratedPromptUsed(res.enhancedPrompt || imagePrompt);
      setReferenceAnalysis(res.referenceAnalysis);
      setModelUsedResult(res.modelUsed || 'Nano Banana 2.1 Engine');
      addXP(120, 'توليد أصل بصري بالبرومبت والريفرنس');
      showToast(language === 'ar' ? 'تم توليد الصورة بنجاح ودون أي أخطاء!' : 'Image generated successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Image generation failed', 'error');
    } finally {
      setImageLoading(false);
    }
  };

  const handleDirectDownload = () => {
    if (!generatedImageUrl) return;
    const fileName = `Noor_Design_Artwork_${Date.now()}.png`;
    if (generatedImageUrl.startsWith('data:image/')) {
      const a = document.createElement('a');
      a.href = generatedImageUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const downloadUrl = `/api/image/download?url=${encodeURIComponent(generatedImageUrl)}&filename=${encodeURIComponent(fileName)}`;
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    showToast(language === 'ar' ? 'تم بدء تحميل الصورة الأصلية بجودة فائقة وبدون أي علامة مائية!' : 'Downloading watermark-free HD image!', 'success');
  };

  const handleCleanWatermark = async (customImg?: string) => {
    const target = customImg || generatedImageUrl;
    if (!target) return;
    setCleaningWatermark(true);
    try {
      const res = await aiService.removeWatermark(target);
      if (res.cleanImageUrl) {
        setGeneratedImageUrl(res.cleanImageUrl);
        showToast(language === 'ar' ? 'تم حذف العلامة المائية واسم الموقع بنجاح والتصميم الآن نقي 100% بدون أي شوائب!' : 'Watermark removed successfully!', 'success');
        addXP(60, 'إزالة علامة مائية بالذكاء الاصطناعي');
      }
    } catch (err: any) {
      showToast(language === 'ar' ? 'تعذر إزالة العلامة المائية: ' + err.message : err.message, 'error');
    } finally {
      setCleaningWatermark(false);
    }
  };

  const handleUploadWatermarkedImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const b64 = evt.target?.result as string;
      setGeneratedImageUrl(b64);
      await handleCleanWatermark(b64);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveToProject = () => {
    if (!activeProject || !generatedImageUrl) {
      showToast(language === 'ar' ? 'يرجى اختيار مشروع نشط أولاً لحفظ التصميم فيه' : 'Select an active project first', 'warning');
      return;
    }
    addProjectVersion(activeProject.id, {
      versionName: `نسخة AI تجارية - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      notes: generatedPromptUsed || 'تصميم بدون علامة مائية من استوديو الصور',
      imageUrl: generatedImageUrl,
      score: 96,
      feedback: 'تم توليد هذا الأصل البصري بدقة فائقة وبدون أي علامات مائية وجاهز للتسليم التجاري.'
    });
    showToast(language === 'ar' ? `تم حفظ التصميم بنجاح في مشروع "${activeProject.title}"` : 'Saved to active project', 'success');
  };

  const handleAddToPortfolio = () => {
    if (!generatedImageUrl) return;
    addPortfolioItem({
      title: 'تصميم إعلاني فائق الجودة — ' + (stylePreset || 'Modern Commercial'),
      category: 'Advertising',
      coverImage: generatedImageUrl,
      finalDesignUrl: generatedImageUrl,
      description: generatedPromptUsed || 'تصميم إعلاني فائق الجودة مولد بالذكاء الاصطناعي بدون أي علامة مائية',
      problem: 'الحاجة إلى أصل بصري إعلاني فخم يحقق جذب بصري فوري للجمهور المستهدف',
      strategy: 'تطبيق الإضاءة السينمائية والمساحة السلبية للتنفس البصري والاتزان الهرمي',
      process: 'تم التوليد بنماذج استوديو الذكاء الاصطناعي الاحترافية وفحص الاتزان البصري بدون علامة مائية',
      toolsUsed: ['DesignForge AI', 'Nano Banana 2.1', 'Pro Studio'],
      aiInsights: 'تصميم متزن بصرياً مع تباين لوني مدروس للاستخدام التجاري',
      isPublic: true,
      isFeatured: true,
    });
    showToast(language === 'ar' ? 'تمت إضافة التصميم لمعرض أعمالك (Portfolio) بنجاح!' : 'Added to portfolio!', 'success');
  };

  const handleDiscussInChat = () => {
    if (!generatedImageUrl) return;
    setActiveTab('chat');
    setChatAttachedMedia(generatedImageUrl);
    setChatAttachedMediaType('image');
    setChatInput(language === 'ar' ? 'إيه رأيك في الصورة دي اللي ولدتها في الاستوديو؟ إيه اللي صح وإيه اللي غلط فيها وكيف أطورها أكثر لمستوى الوكالات العالمية؟' : 'What is your senior critique on this artwork?');
  };

  // 4. Video Generation with Veo
  const handleGenerateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoPrompt.trim() && !sourceImageForVideo) {
      showToast(language === 'ar' ? 'يرجى إدخال وصف التحريك' : 'Provide motion prompt', 'warning');
      return;
    }

    setVideoLoading(true);
    setGeneratedVideoUrl(null);
    setVideoStatusMessage(language === 'ar' ? 'جاري استدعاء نموذج Veo 3.1 وبناء المشهد الحركي...' : 'Initiating Veo 3.1 video...');

    try {
      const initRes = await aiService.generateVideo({
        prompt: videoPrompt,
        imageData: sourceImageForVideo || undefined,
        aspectRatio: videoAspectRatio,
      });

      const opName = initRes.operationName;
      setVideoStatusMessage(language === 'ar' ? 'جاري تحريك الإطارات والظلال (قد يستغرق 30-90 ثانية)...' : 'Rendering motion frames...');

      let attempts = 0;
      const pollInterval = setInterval(async () => {
        attempts++;
        try {
          const statusRes = await aiService.checkVideoStatus(opName);
          if (statusRes.done) {
            clearInterval(pollInterval);
            setVideoStatusMessage(language === 'ar' ? 'جاري تنزيل ملف الفيديو النهائي...' : 'Downloading video...');
            const videoBlobUrl = await aiService.downloadVideoBlob(opName);
            setGeneratedVideoUrl(videoBlobUrl);
            setVideoLoading(false);
            showToast(language === 'ar' ? 'تم تحريك وتوليد الفيديو بنجاح!' : 'Video generated successfully!', 'success');
          } else if (statusRes.error) {
            clearInterval(pollInterval);
            setVideoLoading(false);
            showToast(statusRes.error.message || 'Video generation failed', 'error');
          }
        } catch (pollErr) {
          if (attempts > 60) {
            clearInterval(pollInterval);
            setVideoLoading(false);
            showToast('Timed out waiting for video', 'error');
          }
        }
      }, 5000);
    } catch (err: any) {
      setVideoLoading(false);
      showToast(err.message || 'Video generation failed', 'error');
    }
  };

  // 5. Chat Media Upload
  const handleChatMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVid = file.type.startsWith('video/');
      setChatAttachedMediaType(isVid ? 'video' : 'image');
      const reader = new FileReader();
      reader.onload = (event) => {
        setChatAttachedMedia(event.target?.result as string);
        showToast(language === 'ar' ? `تم إرفاق ${isVid ? 'الفيديو' : 'الصورة'} للمحادثة` : 'Media attached', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || chatInput;
    if (!textToSend.trim() && !chatAttachedMedia) return;

    const userMsg: CoachMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: textToSend,
      attachmentUrl: chatAttachedMedia || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...(activeConv?.messages || []), userMsg];
    updateActiveConversationMessages(updatedMessages);

    setChatInput('');
    setChatAttachedMedia(null);
    setChatLoading(true);

    try {
      const context = {
        designerName: userProfile.name || 'نور',
        activeProjectTitle: activeProject?.title,
        briefProblem: briefAnalysis?.coreProblem,
        persona,
      };

      const reply = await aiService.answerDesignQuestion({
        messages: updatedMessages.map((m) => ({
          role: m.role,
          content: m.content,
          attachmentUrl: m.attachmentUrl,
        })),
        context,
        model: selectedChatModel,
        persona,
        language,
      });

      const assistantMsg: CoachMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      updateActiveConversationMessages([...updatedMessages, assistantMsg]);
    } catch (err: any) {
      showToast(language === 'ar' ? 'تعذر الحصول على الرد' : 'Response failed', 'error');
    } finally {
      setChatLoading(false);
    }
  };

  // Quick Chat Prompts (ChatGPT style)
  const quickChatChips = [
    {
      labelAr: '👋 أهلاً يا شات، ساعدني أبدأ فكرة تصميم',
      labelEn: 'Brainstorm New Concept',
      prompt: 'أهلاً! عايزك تساعدني كشريك إبداعي في تصميم فكرة مبتكرة وغير مكررة لإعلان جديد. اقترح لي 3 زوايا فنية جريئة.',
    },
    {
      labelAr: '🎨 اقترح لي ألوان فخمة متناسقة مع كودات HEX',
      labelEn: 'Suggest Color Palette',
      prompt: 'اقترح لي باليتة ألوان فاخرة وعصرية مع كودات HEX ونسب 60-30-10 تناسب هوية علامة تجارية راقية.',
    },
    {
      labelAr: '✍️ اكتب لي عناوين ونصوص تسويقية جذابة',
      labelEn: 'Write Copy & Headlines',
      prompt: 'اكتب لي 3 اقتراحات لعناوين رئيسية وفرعية جذابة وقصيرة تخطف انتباه العميل في أول ثانيتين.',
    },
    {
      labelAr: '⚖️ إيه رأيك في الفكرة دي: صح ولا غلط؟',
      labelEn: 'Critique My Idea',
      prompt: 'قل لي رأيك الصريح في فكرة تصميمي: إيه اللي صح فيها وإيه اللي غلط؟ وإزاي أطورها لمستوى الوكالات العالمية؟',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in pb-16">
      {/* Top Banner & Calm Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Bot className="w-4 h-4 text-emerald-400" />
            <span>{language === 'ar' ? 'المساعد الإبداعي الذكي واستوديو الصور' : 'AI Design Co-Pilot & Studio'}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            {language === 'ar' ? 'مساحة العمل الإبداعية لمصممي الجرافيك' : 'Creative Workspace & Design Companion'}
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            {language === 'ar'
              ? `مرحباً يا ${userProfile.name || 'نور'}! تحدث معي في أي وقت كشات بوت تفاعلي مثل ChatGPT، ولد صوراً احترافية بالبرومبت والريفرنس بدون أي أخطاء، وامشِ معي خطوة بخطوة في أي بريف.`
              : 'Chat with your AI partner like ChatGPT, generate images with prompt & reference, and execute briefs step by step.'}
          </p>
        </div>

        {/* Primary Clear Tab Bar */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-[#0b0f17] border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('media')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'media'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'توليد الصور بالبرومبت والريفرنس' : 'Prompt + Reference'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'chat'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'شات بوت المصمم (ChatGPT)' : 'AI Designer Chat'}</span>
          </button>

          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'workflow'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'رحلة البريف خطوة بخطوة' : 'Step-by-Step Brief'}</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'audit'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ScanEye className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'فحص صح وغلط (صور وفيديو)' : 'Right vs Wrong Audit'}</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB: POWER MODELS & REFERENCE IMAGE STUDIO */}
      {/* ======================================================== */}
      {activeTab === 'media' && (
        <div className="space-y-6">
          <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-amber-400" />
                  <span>{language === 'ar' ? 'استوديو توليد الصور بالبرومبت والريفرنس (Prompt + Reference)' : 'Prompt + Reference Image Studio'}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {language === 'ar'
                    ? 'اكتب وصف فكرتك، وارفع أي صورة مرجعية (ريفرنس) لنقل الأسلوب أو التكوين اللوني إلى تصميمك الجديد فوراً وبدون أخطاء!'
                    : 'Combine text prompts with reference images for style transfer, composition framing, and high-fidelity asset creation.'}
                </p>
              </div>

              {/* Mode Switcher: Image or Video */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                <button
                  onClick={() => setMediaMode('image')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    mediaMode === 'image' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'توليد صور فنية' : 'Generate Image'}</span>
                </button>
                <button
                  onClick={() => setMediaMode('video')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    mediaMode === 'video' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'تحريك فيديو (Veo)' : 'Generate Video'}</span>
                </button>
              </div>
            </div>

            {/* IMAGE GENERATION WITH PROMPT + REFERENCE */}
            {mediaMode === 'image' && (
              <form onSubmit={handleGenerateImage} className="space-y-5">
                {/* 1. REFERENCE IMAGE SECTION */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Split className="w-4 h-4 text-indigo-400" />
                      <span>{language === 'ar' ? 'الصورة المرجعية (Reference Image) — اختياري:' : 'Reference Image (Optional):'}</span>
                    </span>

                    {referenceImage && (
                      <button
                        type="button"
                        onClick={() => setReferenceImage(null)}
                        className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'إزالة الريفرنس' : 'Remove Reference'}</span>
                      </button>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={referenceFileInputRef}
                    accept="image/*"
                    onChange={handleReferenceUpload}
                    className="hidden"
                  />

                  {referenceImage ? (
                    <div className="flex flex-col sm:flex-row items-center gap-4 p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <img
                        src={referenceImage}
                        alt="Reference preview"
                        className="w-24 h-24 rounded-xl object-cover border border-white/10 shrink-0"
                      />
                      <div className="flex-1 space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-600/20 text-emerald-300 text-[10px] font-bold">
                            {language === 'ar' ? '✓ تم تفعيل الريفرنس' : '✓ Reference Active'}
                          </span>
                          <span className="text-slate-400 text-[11px]">
                            {language === 'ar' ? 'اختر كيف يؤثر الريفرنس على التصميم الجديد:' : 'Select influence mode:'}
                          </span>
                        </div>

                        {/* Reference Modes */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {[
                            {
                              id: 'style' as const,
                              titleAr: '🎨 تطابق الأسلوب والألوان',
                              descAr: 'استلهام باليتة الألوان والإضاءة والمزاج العام',
                            },
                            {
                              id: 'composition' as const,
                              titleAr: '📐 تطابق التكوين والهيكل',
                              descAr: 'الحفاظ على هندسة الكتل ومواضع العناصر',
                            },
                            {
                              id: 'subject' as const,
                              titleAr: '🔄 إعادة تخيل الموضوع',
                              descAr: 'نقل العنصر الأساسي إلى بيئة إبداعية جديدة',
                            },
                          ].map((mode) => (
                            <button
                              key={mode.id}
                              type="button"
                              onClick={() => setReferenceMode(mode.id)}
                              className={`p-2 rounded-xl text-start text-xs transition-all border ${
                                referenceMode === mode.id
                                  ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold'
                                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                              }`}
                            >
                              <div className="text-[11px]">{mode.titleAr}</div>
                              <div className="text-[9px] text-slate-400 font-normal">{mode.descAr}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => referenceFileInputRef.current?.click()}
                      className="p-6 rounded-xl border border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-900/40 text-center cursor-pointer transition-colors space-y-1 text-slate-400"
                    >
                      <ImageIcon className="w-8 h-8 mx-auto text-slate-500" />
                      <p className="text-xs font-medium text-slate-300">
                        {language === 'ar'
                          ? 'اسحب أو انقر لرفع صورة مرجعية (PNG, JPG, WebP) لتوليد تصميم متوافق معها'
                          : 'Click or drop a reference image to transfer its style/composition'}
                      </p>
                      <span className="text-[10px] text-slate-500 block">
                        {language === 'ar' ? 'مثال: صورة بوستر أعجبك، صورة منتج العميل، أو نمط إضاءة تريد تكراره' : 'e.g. Poster layout, client product photo, or lighting reference'}
                      </span>
                    </div>
                  )}
                </div>

                {/* 2. TEXT PROMPT INPUT */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      {language === 'ar' ? 'وصف التصميم المراد توليده (البرومبت):' : 'Image Prompt:'}
                    </label>
                    <label className="flex items-center gap-1.5 text-[11px] text-indigo-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enhancePromptWithAI}
                        onChange={(e) => setEnhancePromptWithAI(e.target.checked)}
                        className="rounded accent-indigo-600"
                      />
                      <span>{language === 'ar' ? 'تعزيز البرومبت تلقائياً بأسلوب الوكالات العالمية' : 'Enhance prompt with AI'}</span>
                    </label>
                  </div>

                  {/* Quick Prompt Inspiration Templates */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {[
                      { label: '🍾 عطر فاخر', prompt: 'تصميم إعلان عطر فاخر على قاعدة رخامية سوداء مع إضاءة استوديو سينمائية ذهبية ناعمة ومساحة سلبية للنصوص' },
                      { label: '⚡ كانز مثلج', prompt: 'علبة كانز مشروب طاقة مثلجة مع قطرات ماء باردة متناثرة وإضاءة نيون زرقاء على خلفية داكنة' },
                      { label: '🏎️ بوستر سيارة', prompt: 'بوستر سيارة كهربائية فائقة السرعة تسير في شوارع مستقبلية مظلمة بإضاءة سينمائية وعاكسات أرضية' },
                      { label: '💎 سيروم تجميل', prompt: 'زجاجة قطارة سيروم عناية بالبشرة محاطة بأوراق نباتات طبيعية نضرة وظلال شمس دافئة مينيمال' },
                      { label: '☕ قهوة كولد برو', prompt: 'زجاجة قهوة كولد برو عنبرية مثلجة موضوعة على سطح خرساني مودرن مع مكعبات ثلج وحبات بن محروق' },
                    ].map((tpl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setImagePrompt(tpl.prompt)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 hover:text-white transition-colors"
                      >
                        {tpl.label}
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={3}
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder={
                      language === 'ar'
                        ? 'مثال: تصميم إعلان عطر فاخر على قاعدة رخامية داكنة مع إضاءة سينمائية ذهبية ناعمة ومساحة سلبية علوية للنصوص...'
                        : 'e.g. Luxury minimalist perfume on dark marble pedestal, golden rim lighting, empty negative space for typography...'
                    }
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs md:text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* 3. MODEL, STYLE PRESET & ASPECT RATIO */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      {language === 'ar' ? 'النموذج الذكي (Power Model):' : 'Engine / Model:'}
                    </label>
                    <select
                      value={selectedPowerModel}
                      onChange={(e) => setSelectedPowerModel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500 font-medium"
                    >
                      <option value="gemini-nano-banana-2.1">🍌 Nano Banana 2.1 (Ultra Creative Engine)</option>
                      <option value="chatgpt-dalle-engine">🟢 ChatGPT / DALL-E 3 Style Studio</option>
                      <option value="midjourney-v6">🟣 Midjourney v6.1 Ultra Creative</option>
                      <option value="seedance-3.1">🌊 Seedance 3.1 Creative Visual</option>
                      <option value="imagen-3.0-generate-002">⚡ Imagen 3.0 Fast Commercial</option>
                      <option value="neural-flux-studio">🚀 Neural Flux Pro 8K</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      {language === 'ar' ? 'النمط البصري (Preset):' : 'Style Preset:'}
                    </label>
                    <select
                      value={stylePreset}
                      onChange={(e) => setStylePreset(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="luxury_minimal">Luxury Minimalist (فخامة هادئة وبساطة)</option>
                      <option value="cyber_arabic">Cyber Arabic Future (مستقبل عربي نيون)</option>
                      <option value="editorial_vogue">Editorial Vogue Cover (مجلة أزياء سينمائية)</option>
                      <option value="dalle_3d_render">3D Clay & Glass Render (ريندر ثلاثي أبعاد)</option>
                      <option value="product_hero">Commercial Product Hero (تصوير منتجات تجاري)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      {language === 'ar' ? 'نسبة الأبعاد (Aspect Ratio):' : 'Aspect Ratio:'}
                    </label>
                    <div className="grid grid-cols-5 gap-1">
                      {(['1:1', '9:16', '16:9', '4:3', '3:4'] as const).map((ar) => (
                        <button
                          key={ar}
                          type="button"
                          onClick={() => setImageAspectRatio(ar)}
                          className={`py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all ${
                            imageAspectRatio === ar ? 'bg-amber-600 text-white shadow-sm' : 'bg-slate-950 text-slate-400 hover:text-white'
                          }`}
                        >
                          {ar}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={imageLoading || (!imagePrompt.trim() && !referenceImage)}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-600/25 transition-all active:scale-95 disabled:opacity-50"
                >
                  {imageLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                  <span>
                    {referenceImage
                      ? language === 'ar' ? 'توليد التصميم الجديد بالبرومبت والريفرنس الآن' : 'Synthesize with Prompt & Reference'
                      : language === 'ar' ? 'توليد الصورة بالموديل المختار الآن' : 'Synthesize Design Artwork'}
                  </span>
                </button>
              </form>
            )}

            {/* VIDEO GENERATION (VEO 3.1) */}
            {mediaMode === 'video' && (
              <form onSubmit={handleGenerateVideo} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    {language === 'ar' ? 'وصف الحركة ونموذج Veo 3.1:' : 'Motion Prompt:'}
                  </label>
                  <textarea
                    rows={3}
                    value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                    placeholder={
                      language === 'ar'
                        ? 'مثال: A slow elegant camera orbit around a luxury perfume bottle, subtle light glimmers on the glass, floating dust particles in dark studio...'
                        : 'Slow orbit around product with volumetric lighting...'
                    }
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs md:text-sm text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-400 font-semibold">{language === 'ar' ? 'مقاس الفيديو:' : 'Aspect Ratio:'}</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setVideoAspectRatio('9:16')}
                      className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                        videoAspectRatio === '9:16' ? 'bg-sky-600 text-white' : 'bg-slate-950 text-slate-400'
                      }`}
                    >
                      9:16 (Reels & Story)
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoAspectRatio('16:9')}
                      className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                        videoAspectRatio === '16:9' ? 'bg-sky-600 text-white' : 'bg-slate-950 text-slate-400'
                      }`}
                    >
                      16:9 (Cinematic Display)
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={videoLoading || !videoPrompt.trim()}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-600/25 transition-all active:scale-95 disabled:opacity-50"
                >
                  {videoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Film className="w-4 h-4" />}
                  <span>{language === 'ar' ? 'بدء تحريك وتوليد الفيديو عبر Veo 3.1' : 'Render Motion Reel with Veo 3.1'}</span>
                </button>

                {videoLoading && (
                  <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-500/30 text-xs text-sky-200 flex items-center gap-2.5">
                    <Loader2 className="w-4 h-4 animate-spin text-sky-400 shrink-0" />
                    <span>{videoStatusMessage}</span>
                  </div>
                )}
              </form>
            )}

            {/* GENERATED RESULT & COMPARISON DISPLAY */}
            {(generatedImageUrl || generatedVideoUrl) && (
              <div className="pt-6 border-t border-slate-800 space-y-4 animate-in fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <h3 className="text-sm font-bold text-white">
                        {language === 'ar' ? 'النتيجة الفنية المولدة بنجاح:' : 'Generated Artwork Result:'}
                      </h3>
                      {modelUsedResult && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-600/20 text-amber-300 text-[10px] font-mono font-bold">
                          {modelUsedResult}
                        </span>
                      )}
                    </div>
                    {referenceAnalysis && (
                      <p className="text-[11px] text-slate-400">
                        {language === 'ar'
                          ? `تم دمج الريفرنس بنجاح: ${referenceAnalysis.style || 'تناسق لوني وإضاءة متوافقة'}`
                          : 'Reference blended successfully.'}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {/* Watermark-Free Certified Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>{language === 'ar' ? '100% مجاني وبدون أي علامة مائية' : '100% Free & No Watermark'}</span>
                    </div>

                    {generatedImageUrl && (
                      <>
                        <button
                          type="button"
                          onClick={handleDirectDownload}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-amber-600/25 active:scale-95"
                          title={language === 'ar' ? 'تحميل الصورة الأصلية بدون علامة مائية' : 'Download HD Image'}
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{language === 'ar' ? 'تحميل بدون علامة مائية' : 'Download Clean HD'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleSaveToProject}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                          title={language === 'ar' ? 'حفظ التصميم كنسخة جديدة في المشروع النشط' : 'Save to Project'}
                        >
                          <FolderPlus className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{language === 'ar' ? 'حفظ في مشروعي' : 'Save to Project'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleAddToPortfolio}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                          title={language === 'ar' ? 'إضافة إلى معرض أعمالك' : 'Add to Portfolio'}
                        >
                          <Crown className="w-3.5 h-3.5 text-amber-400" />
                          <span>{language === 'ar' ? 'للبورتفوليو' : 'Portfolio'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleDiscussInChat}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-emerald-500/30"
                          title={language === 'ar' ? 'مناقشة النتيجة مع الشات بوت' : 'Discuss with AI'}
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{language === 'ar' ? 'اسأل الشات' : 'Ask Chat'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setCritiqueSampleImage(generatedImageUrl);
                            setActiveSection('critique');
                            showToast(language === 'ar' ? 'تم نقل الصورة لمختبر النقد الفني' : 'Sent to Critique', 'success');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-indigo-500/30"
                        >
                          <ScanEye className="w-3.5 h-3.5" />
                          <span>{language === 'ar' ? 'فحص النقد' : 'Critique'}</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Instant Visual Studio Enhancers & Filter Controls */}
                {generatedImageUrl && (
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-slate-400 text-[11px] font-bold me-1">
                        {language === 'ar' ? 'تحسين الألوان الفوري:' : 'Instant Color Tuning:'}
                      </span>
                      {[
                        { id: 'normal' as const, label: language === 'ar' ? 'الأصلية' : 'Original' },
                        { id: 'cinematic' as const, label: language === 'ar' ? 'سينمائي 🎬' : 'Cinematic' },
                        { id: 'luxury_gold' as const, label: language === 'ar' ? 'فخامة ذهبية 👑' : 'Luxury Gold' },
                        { id: 'cyber_neon' as const, label: language === 'ar' ? 'نيون مستقبلي ⚡' : 'Cyber Neon' },
                        { id: 'noir_bw' as const, label: language === 'ar' ? 'أبيض وأسود تحريري 🎞️' : 'Editorial B&W' },
                      ].map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setActiveFilter(f.id)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
                            activeFilter === f.id
                              ? 'bg-amber-600 text-white font-bold shadow-sm'
                              : 'bg-slate-900 text-slate-400 hover:text-white'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="file"
                        ref={watermarkFileInputRef}
                        accept="image/*"
                        onChange={handleUploadWatermarkedImage}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => watermarkFileInputRef.current?.click()}
                        className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-violet-300 border border-violet-500/30 text-[11px] font-bold flex items-center gap-1.5 transition-all"
                        title={language === 'ar' ? 'رفع صورة خارجية لحذف العلامة المائية منها فوراً' : 'Upload image to remove watermark'}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'رفع صورة لإزالة علامتها' : 'Clean Custom Image'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCleanWatermark()}
                        disabled={cleaningWatermark}
                        className="px-3 py-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                        title={language === 'ar' ? 'حذف أي علامات مائية أو كلام موقع من أسفل الصورة' : 'Remove watermark'}
                      >
                        {cleaningWatermark ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Eraser className="w-3.5 h-3.5" />}
                        <span>{language === 'ar' ? 'ممحاة العلامات المائية والكلام' : 'Erase Watermark'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Side-by-Side: Reference ⟷ Generated */}
                <div className={`grid gap-4 ${referenceImage && generatedImageUrl ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                  {referenceImage && (
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <span className="text-[11px] font-bold text-slate-400 block">
                        {language === 'ar' ? 'الصورة المرجعية (Reference Image):' : 'Reference Image:'}
                      </span>
                      <div className="aspect-square rounded-xl overflow-hidden bg-black flex items-center justify-center">
                        <img src={referenceImage} alt="Reference" className="w-full h-full object-contain" />
                      </div>
                    </div>
                  )}

                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-[11px] font-bold text-amber-400 block flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span>{language === 'ar' ? 'النتيجة الفنية المولدة بدون علامة مائية:' : 'Clean Generated Artwork (Watermark-Free):'}</span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>100% Watermark-Free</span>
                        </span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{imageAspectRatio}</span>
                    </span>

                    <div className="relative rounded-xl overflow-hidden bg-black flex items-center justify-center group">
                      {generatedImageUrl && (
                        <img
                          src={generatedImageUrl}
                          alt="Generated visual asset"
                          className={`w-full h-auto max-h-[500px] object-contain transition-all duration-300 ${
                            activeFilter === 'cinematic'
                              ? 'contrast-125 brightness-105 saturate-110'
                              : activeFilter === 'luxury_gold'
                              ? 'sepia-[0.2] contrast-110 brightness-105 hue-rotate-[-10deg]'
                              : activeFilter === 'cyber_neon'
                              ? 'hue-rotate-[30deg] contrast-125 saturate-130'
                              : activeFilter === 'noir_bw'
                              ? 'grayscale contrast-130 brightness-95'
                              : ''
                          }`}
                        />
                      )}
                      {generatedVideoUrl && (
                        <video src={generatedVideoUrl} controls autoPlay loop className="w-full h-auto max-h-[500px]" />
                      )}
                    </div>
                  </div>
                </div>

                {generatedPromptUsed && (
                  <div className="p-3 rounded-xl bg-[#0b0f17] border border-slate-900 text-[11px] font-mono text-slate-400 flex items-center justify-between gap-2">
                    <div className="truncate">
                      <strong className="text-slate-300 font-bold me-1">Prompt:</strong>
                      {generatedPromptUsed}
                    </div>
                    <button
                      onClick={() => handleCopy(generatedPromptUsed, 'gen-prompt')}
                      className="text-slate-400 hover:text-white shrink-0"
                    >
                      {copiedKey === 'gen-prompt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB: CONVERSATIONAL CHATBOT (CHATGPT 4O STYLE) */}
      {/* ======================================================== */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Chat Settings & Session List (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-emerald-400" />
                <span>{language === 'ar' ? 'شخصية ونموذج الذكاء الاصطناعي' : 'AI Model & Persona'}</span>
              </h3>

              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    id: 'chatgpt_style' as CoachPersona,
                    icon: Bot,
                    color: 'text-emerald-400',
                    title: language === 'ar' ? 'شات جي بي تي (ChatGPT 4o)' : 'ChatGPT 4o Designer',
                    desc: language === 'ar' ? 'محادثة ودودة، أفكار فورية، نصوص إعلانية' : 'Fast, friendly creative brainstorming',
                  },
                  {
                    id: 'strict_art_director' as CoachPersona,
                    icon: Crown,
                    color: 'text-amber-400',
                    title: language === 'ar' ? 'الآرت ديركتور الصارم' : 'Strict Art Director',
                    desc: language === 'ar' ? 'صريح، يقولك صح وغلط بدون مجاملة' : 'Brutally honest critique',
                  },
                  {
                    id: 'claude_creative' as CoachPersona,
                    icon: Sparkles,
                    color: 'text-violet-400',
                    title: language === 'ar' ? 'كلود الإبداعي (Claude 3.5)' : 'Claude 3.5 Creative',
                    desc: language === 'ar' ? 'بلاغة بصرية، استعارات عميقة، حلول راقية' : 'Nuanced aesthetic philosophy',
                  },
                  {
                    id: 'senior_mentor' as CoachPersona,
                    icon: GraduationCap,
                    color: 'text-sky-400',
                    title: language === 'ar' ? 'السنيور المرشد الصبور' : 'Senior Mentor',
                    desc: language === 'ar' ? 'يشرح لك الأساسيات خطوة بخطوة' : 'Educational step-by-step',
                  },
                ].map((p) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setPersona(p.id);
                        if (p.id === 'chatgpt_style') setSelectedChatModel('chatgpt-4o');
                        else if (p.id === 'claude_creative') setSelectedChatModel('claude-3.5-sonnet');
                        else setSelectedChatModel('gemini-3.8-flash');
                      }}
                      className={`p-2.5 rounded-2xl text-start transition-all border flex items-center gap-3 ${
                        persona === p.id
                          ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${p.color} shrink-0`} />
                      <div>
                        <div className="text-xs font-bold text-white">{p.title}</div>
                        <div className="text-[10px] text-slate-400">{p.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Model Switcher */}
              <div className="pt-2 border-t border-slate-800">
                <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                  {language === 'ar' ? 'محرك النموذج (Model Engine):' : 'Engine:'}
                </label>
                <div className="grid grid-cols-4 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10px]">
                  {(['chatgpt-4o', 'gemini-2.5-flash', 'claude-3.5-sonnet', 'gemini-3.1-flash-lite'] as GeminiModelId[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setSelectedChatModel(m)}
                      className={`py-1 rounded-lg font-mono font-medium transition-all ${
                        selectedChatModel === m ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {m === 'chatgpt-4o' ? 'ChatGPT' : m === 'gemini-2.5-flash' ? '2.5 Flash' : m === 'claude-3.5-sonnet' ? 'Claude' : '⚡ Lite'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Conversation Session Switcher */}
            <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white">{language === 'ar' ? 'جلسات المحادثة' : 'Sessions'}</span>
                <button
                  onClick={handleNewConversation}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold"
                >
                  + {language === 'ar' ? 'محادثة جديدة' : 'New'}
                </button>
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {conversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveConvId(c.id)}
                    className={`w-full p-2 rounded-xl text-start text-xs font-medium transition-all truncate block ${
                      activeConvId === c.id ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {c.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Window (8 cols) */}
          <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col h-[650px]">
            {/* Header with active model badge and direct model switcher */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>
                      {selectedChatModel === 'chatgpt-4o'
                        ? 'ChatGPT-4o'
                        : selectedChatModel === 'claude-3.5-sonnet'
                        ? 'Claude 3.7 Sonnet'
                        : persona === 'strict_art_director'
                        ? 'Senior Art Director'
                        : 'Gemini AI Partner'}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {language === 'ar' ? 'جاهز ومستعد لأي استفسار أو بريف' : 'Online & Ready'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                  <Zap className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span>{language === 'ar' ? 'استجابة فائقة السرعة (< ثانيتين)' : 'Ultra Fast (<2s)'}</span>
                </div>

                {/* Direct Model Tabs Switcher */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 text-[10px]">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedChatModel('chatgpt-4o');
                      setPersona('chatgpt_style');
                    }}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      selectedChatModel === 'chatgpt-4o'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🟢 ChatGPT-4o
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedChatModel('claude-3.5-sonnet');
                      setPersona('claude_creative');
                    }}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      selectedChatModel === 'claude-3.5-sonnet'
                        ? 'bg-violet-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🟣 Claude 3.7
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedChatModel('gemini-2.5-flash');
                      setPersona('strict_art_director');
                    }}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      persona === 'strict_art_director'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🔴 Senior Director
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedChatModel('gemini-3.1-flash-lite');
                      setPersona('chatgpt_style');
                    }}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      selectedChatModel === 'gemini-3.1-flash-lite'
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    ⚡ Lite (&lt;1s)
                  </button>
                </div>
              </div>

                <button
                  type="button"
                  onClick={handleNewConversation}
                  className="px-2 py-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors ms-1"
                  title={language === 'ar' ? 'محادثة جديدة' : 'New Chat'}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto space-y-4 px-1 py-3">
              {activeConv?.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-none shadow-md shadow-emerald-600/20'
                        : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {msg.attachmentUrl && (
                      <div className="mb-2 rounded-xl overflow-hidden border border-white/10 max-h-56">
                        {msg.attachmentUrl.startsWith('data:video/') ? (
                          <video src={msg.attachmentUrl} controls className="w-full h-auto" />
                        ) : (
                          <img src={msg.attachmentUrl} alt="Attached" className="w-full h-auto object-contain" />
                        )}
                      </div>
                    )}
                    {msg.content}
                  </div>
                  <div className="flex items-center gap-2 mt-1 px-1">
                    <span className="text-[9px] text-slate-500 font-mono">{msg.timestamp}</span>
                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="text-slate-500 hover:text-slate-300 text-[10px] flex items-center gap-1 transition-colors"
                        title={language === 'ar' ? 'نسخ الرد' : 'Copy'}
                      >
                        {copiedKey === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{language === 'ar' ? 'نسخ' : 'Copy'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-emerald-300 w-fit">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>{language === 'ar' ? 'يكتب لك الرد...' : 'Typing response...'}</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Chips like ChatGPT */}
            <div className="pt-2 pb-3 flex flex-wrap gap-1.5 shrink-0 border-t border-slate-800">
              {quickChatChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip.prompt)}
                  className="px-2.5 py-1 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 transition-colors"
                >
                  {language === 'ar' ? chip.labelAr : chip.labelEn}
                </button>
              ))}
            </div>

            {/* Input Bar with Image & Video Attachment */}
            <div className="pt-2 flex flex-col gap-2 shrink-0">
              {chatAttachedMedia && (
                <div className="p-2 rounded-xl bg-slate-950 border border-emerald-500/40 flex items-center justify-between text-xs">
                  <span className="text-emerald-300 flex items-center gap-1.5 font-medium">
                    {chatAttachedMediaType === 'video' ? <Video className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
                    <span>{language === 'ar' ? 'ملف مرفق للمناقشة' : 'Media attached'}</span>
                  </span>
                  <button onClick={() => setChatAttachedMedia(null)} className="text-slate-400 hover:text-rose-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={chatFileInputRef}
                  accept="image/*,video/*"
                  onChange={handleChatMediaUpload}
                  className="hidden"
                />

                <button
                  onClick={() => chatFileInputRef.current?.click()}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                  title={language === 'ar' ? 'إرفاق صورة أو فيديو' : 'Attach media'}
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  placeholder={
                    language === 'ar'
                      ? 'تحدث مع الشات: اكتب أي كلمة أو سؤال وهيجاوبك فوراً...'
                      : 'Type a message to chat...'
                  }
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />

                <button
                  onClick={() => handleSendMessage()}
                  disabled={chatLoading || (!chatInput.trim() && !chatAttachedMedia)}
                  className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all disabled:opacity-40"
                >
                  <Send className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB: STEP-BY-STEP BRIEF WORKFLOW (A TO Z) */}
      {/* ======================================================== */}
      {activeTab === 'workflow' && (
        <div className="space-y-6">
          {/* Brief Input Card */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>{language === 'ar' ? 'أعطني البريف أو طلب العميل' : 'Input Client Brief'}</span>
                </h2>
                <p className="text-xs text-slate-400">
                  {language === 'ar'
                    ? 'اكتب البريف أو استورده، وسيمشي معك الآرت ديركتور خطوة بخطوة من الفكرة الأولى حتى الملف الجاهز للتسليم.'
                    : 'Input brief to generate custom sequential steps, research sites, typography pairs, and audit rules.'}
                </p>
              </div>

              {activeProject && (
                <button
                  type="button"
                  onClick={handleLoadActiveProject}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? `استيراد: ${activeProject.title}` : 'Import Active Project'}</span>
                </button>
              )}
            </div>

            <form onSubmit={handleRunBriefDeconstruction} className="space-y-4">
              <div>
                <textarea
                  required
                  rows={3}
                  value={briefInput}
                  onChange={(e) => setBriefInput(e.target.value)}
                  placeholder={
                    language === 'ar'
                      ? 'مثال: مطلوب هوية بصرية وبوسترات سوشيال ميديا لإطلاق عطر فاخر مستوحى من الصحراء والهدوء الليلي، موجه للشباب في الخليج، العميل يريد الابتعاد عن النمطية والتركيز على البساطة الصارمة...'
                      : 'e.g. Luxury desert-inspired perfume social media launch, young Gulf demographic, minimalist aesthetic...'
                  }
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    {language === 'ar' ? 'اسم العميل / العلامة التجارية:' : 'Client Name:'}
                  </label>
                  <input
                    type="text"
                    value={briefClient}
                    onChange={(e) => setBriefClient(e.target.value)}
                    placeholder="e.g. Desert Oud"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    {language === 'ar' ? 'القطاع التجاري:' : 'Industry:'}
                  </label>
                  <select
                    value={briefIndustry}
                    onChange={(e) => setBriefIndustry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Branding & Luxury">Branding & Luxury (عطور وفخامة)</option>
                    <option value="Food & Beverage">Food & Beverage (مطاعم وكافيهات)</option>
                    <option value="Technology & AI">Technology & AI (تقنية وابتكار)</option>
                    <option value="Fashion & Apparel">Fashion & Apparel (أزياء وموضة)</option>
                    <option value="Real Estate">Real Estate (عقارات وتطوير)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    {language === 'ar' ? 'المنصة والمقاس الأساسي:' : 'Deliverable Platform:'}
                  </label>
                  <input
                    type="text"
                    value={briefPlatform}
                    onChange={(e) => setBriefPlatform(e.target.value)}
                    placeholder="e.g. Instagram (4:5 & 9:16)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={briefLoading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all active:scale-95 disabled:opacity-50"
              >
                {briefLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>
                  {language === 'ar'
                    ? 'تشريح البريف والبدء خطوة بخطوة من الألف إلى الياء'
                    : 'Deconstruct Brief & Launch Step-by-Step Co-Pilot'}
                </span>
              </button>
            </form>
          </div>

          {/* Sequential Step-by-Step Navigator */}
          {briefAnalysis && (
            <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                {[
                  { step: 1, labelAr: '1. الهدف والجمهور', labelEn: '1. Objective' },
                  { step: 2, labelAr: '2. مواقع وكلمات البحث', labelEn: '2. Inspiration Radar' },
                  { step: 3, labelAr: '3. الخطوط والألوان', labelEn: '3. Type & Colors' },
                  { step: 4, labelAr: '4. توليد أصول الذكاء', labelEn: '4. AI Hero Asset' },
                  { step: 5, labelAr: '5. فحص صح وغلط', labelEn: '5. Right vs Wrong' },
                  { step: 6, labelAr: '6. اللمسات والتسليم', labelEn: '6. Deliverables' },
                ].map((s) => (
                  <button
                    key={s.step}
                    onClick={() => setActiveWorkflowStep(s.step)}
                    className={`p-3 rounded-2xl text-start transition-all border text-xs ${
                      activeWorkflowStep === s.step
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                        : completedSteps[s.step]
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] text-slate-400">Step {s.step}</span>
                      {completedSteps[s.step] && <Check className="w-3 h-3 text-emerald-400" />}
                    </div>
                    <div className="font-bold text-[11px] truncate">
                      {language === 'ar' ? s.labelAr : s.labelEn}
                    </div>
                  </button>
                ))}
              </div>

              {/* STEP 1 */}
              {activeWorkflowStep === 1 && (
                <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-400" />
                      <span>{language === 'ar' ? 'المرحلة 1: تشريح البريف وتحديد الهدف البصري الخفي' : 'Step 1: Brief Dissection'}</span>
                    </h3>
                    <button
                      onClick={() => {
                        setCompletedSteps((prev) => ({ ...prev, 1: true }));
                        setActiveWorkflowStep(2);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <span>{language === 'ar' ? 'التالي: مواقع الإلهام' : 'Next: Inspiration'}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                      <span className="font-bold text-indigo-300 block">
                        {language === 'ar' ? 'المعضلة البصرية الأساسية (The Core Visual Tension):' : 'Core Problem:'}
                      </span>
                      <p className="text-slate-200 leading-relaxed">{briefAnalysis.coreProblem}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                      <span className="font-bold text-sky-300 block">
                        {language === 'ar' ? 'سيكولوجية الجمهور المستهدف (Audience Psychology):' : 'Audience Mindset:'}
                      </span>
                      <p className="text-slate-200 leading-relaxed">{briefAnalysis.audiencePsychology}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {activeWorkflowStep === 2 && (
                <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Search className="w-4 h-4 text-emerald-400" />
                      <span>{language === 'ar' ? 'المرحلة 2: مواقع الإلهام وكلمات البحث المحددة' : 'Step 2: Inspiration Radar'}</span>
                    </h3>
                    <button
                      onClick={() => {
                        setCompletedSteps((prev) => ({ ...prev, 2: true }));
                        setActiveWorkflowStep(3);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <span>{language === 'ar' ? 'التالي: الخطوط والألوان' : 'Next: Type & Colors'}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {briefAnalysis.moodboardKeywords.map((kw, i) => {
                      const searchUrl =
                        kw.platform === 'Behance'
                          ? `https://www.behance.net/search/projects?search=${encodeURIComponent(kw.query)}`
                          : kw.platform === 'Pinterest'
                          ? `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(kw.query)}`
                          : `https://savee.it/search/?q=${encodeURIComponent(kw.query)}`;

                      return (
                        <div key={i} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <span className="px-2 py-0.5 rounded-md bg-indigo-600/20 text-indigo-300 text-[10px] font-mono font-bold">
                              {kw.platform}
                            </span>
                            <div className="font-mono text-xs font-bold text-white">{kw.query}</div>
                            <p className="text-[11px] text-slate-400 leading-relaxed">{kw.rationale}</p>
                          </div>

                          <a
                            href={searchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pt-2 text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5 border-t border-slate-900"
                          >
                            <span>{language === 'ar' ? `فتح البحث على ${kw.platform}` : `Search on ${kw.platform}`}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {activeWorkflowStep === 3 && (
                <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Palette className="w-4 h-4 text-violet-400" />
                      <span>{language === 'ar' ? 'المرحلة 3: التوجيه الفني، الخطوط، ونظام الألوان 60-30-10' : 'Step 3: Art Direction'}</span>
                    </h3>
                    <button
                      onClick={() => {
                        setCompletedSteps((prev) => ({ ...prev, 3: true }));
                        setActiveWorkflowStep(4);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <span>{language === 'ar' ? 'التالي: توليد أصل البطل' : 'Next: AI Hero Asset'}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {briefAnalysis.colorPalette.map((col, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleCopy(col.hex, `col-${idx}`)}
                        className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3 cursor-pointer hover:border-indigo-500/50 transition-all"
                      >
                        <div
                          className="w-12 h-12 rounded-xl shadow-inner shrink-0 border border-white/20"
                          style={{ backgroundColor: col.hex }}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-xs text-white">{col.hex}</span>
                            <span className="text-[10px] text-indigo-400 font-mono font-bold">({col.percentage})</span>
                          </div>
                          <span className="text-[11px] text-slate-400 block truncate">{col.role}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4 */}
              {activeWorkflowStep === 4 && (
                <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Wand2 className="w-4 h-4 text-amber-400" />
                      <span>{language === 'ar' ? 'المرحلة 4: توليد الأصول البصرية بالذكاء الاصطناعي' : 'Step 4: AI Hero Asset'}</span>
                    </h3>
                    <button
                      onClick={() => {
                        setCompletedSteps((prev) => ({ ...prev, 4: true }));
                        setActiveWorkflowStep(5);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <span>{language === 'ar' ? 'التالي: فحص التصميم' : 'Next: Audit Draft'}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <span className="text-xs font-bold text-amber-300 block">
                      {language === 'ar' ? 'موجه صورة البطل (Art Director Prompt):' : 'Hero Prompt:'}
                    </span>
                    <p className="text-xs font-mono text-slate-200 bg-[#0b0f17] p-3 rounded-xl border border-slate-900 leading-relaxed">
                      {briefAnalysis.aiImagePrompt}
                    </p>
                    <button
                      onClick={() => {
                        setImagePrompt(briefAnalysis.aiImagePrompt);
                        setActiveTab('media');
                        showToast(language === 'ar' ? 'تم نقل الموجه لاستوديو التوليد!' : 'Moved to Media Studio', 'info');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-amber-600/20"
                    >
                      <Wand2 className="w-4 h-4" />
                      <span>{language === 'ar' ? 'توليد الصورة بموديل النانو بنانا الآن' : 'Generate with Nano Banana Now'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5 */}
              {activeWorkflowStep === 5 && (
                <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <ScanEye className="w-4 h-4 text-emerald-400" />
                      <span>{language === 'ar' ? 'المرحلة 5: فحص ونقد مسودة العمل (صح وغلط بالمللي)' : 'Step 5: Right vs Wrong Audit'}</span>
                    </h3>
                    <button
                      onClick={() => {
                        setCompletedSteps((prev) => ({ ...prev, 5: true }));
                        setActiveWorkflowStep(6);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <span>{language === 'ar' ? 'التالي: قائمة التسليم' : 'Next: Deliverables'}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2 text-xs">
                      <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{language === 'ar' ? 'قواعد التنفيذ الصحيحة (DO):' : 'Execution Rules (DO):'}</span>
                      </span>
                      <ul className="space-y-1.5 text-emerald-200/90">
                        {briefAnalysis.dosAndDonts.do.map((item, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-400">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2 text-xs">
                      <span className="font-bold text-rose-400 flex items-center gap-1.5">
                        <XCircle className="w-4 h-4" />
                        <span>{language === 'ar' ? 'الأخطاء القاتلة لتجنبها (DON’T):' : 'Crucial Pitfalls (DON’T):'}</span>
                      </span>
                      <ul className="space-y-1.5 text-rose-200/90">
                        {briefAnalysis.dosAndDonts.dont.map((item, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-rose-400">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6 */}
              {activeWorkflowStep === 6 && (
                <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{language === 'ar' ? 'المرحلة 6: اللمسات النهائية وتجهيز ملفات التسليم' : 'Step 6: Final Polish'}</span>
                    </h3>
                    <button
                      onClick={() => {
                        setCompletedSteps((prev) => ({ ...prev, 6: true }));
                        showToast(language === 'ar' ? 'مبروك! أكملت رحلة تنفيذ البريف بنجاح!' : 'Completed workflow journey!', 'success');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'اكتمال تنفيذ البريف' : 'Complete Brief'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {[
                      { title: 'فحص التباين بمعدل 4.5:1 على كل النصوص', check: true },
                      { title: 'ترك هوامش أمان 32px على الأقل من كل الحواف', check: true },
                      { title: 'تصدير بصيغتي sRGB للألوان للشاشات الرقمية', check: true },
                      { title: 'تجهيز موك اب ثلاثي الأبعاد واقعي لعرضه على العميل', check: true },
                    ].map((ch, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2.5 text-slate-200">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{ch.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB: RIGHT VS WRONG MEDIA AUDIT (IMAGES & VIDEOS) */}
      {/* ======================================================== */}
      {activeTab === 'audit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <ScanEye className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'ar' ? 'رفع التصميم أو الفيديو للفحص' : 'Upload Work for Audit'}</span>
                </span>

                <button
                  onClick={() => auditFileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-emerald-500/30"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'اختيار ملف' : 'Select File'}</span>
                </button>
              </div>

              <input
                type="file"
                ref={auditFileInputRef}
                accept="image/*,video/*"
                onChange={handleAuditMediaUpload}
                className="hidden"
              />

              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
                {auditMedia ? (
                  auditMediaType === 'video' ? (
                    <video src={auditMedia} controls autoPlay loop muted className="w-full h-full object-contain bg-black" />
                  ) : (
                    <img src={auditMedia} alt="Audit preview" className="w-full h-full object-cover" />
                  )
                ) : (
                  <div
                    onClick={() => auditFileInputRef.current?.click()}
                    className="text-center p-6 space-y-2 text-slate-500 cursor-pointer"
                  >
                    <ImageIcon className="w-10 h-10 mx-auto" />
                    <p className="text-xs font-medium">
                      {language === 'ar' ? 'انقر لرفع مسودة التصميم (صورة) أو فيديو موشن ريلز' : 'Click to upload image or video'}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    {language === 'ar' ? 'هدف التصميم / متطلبات البريف:' : 'Brief Goal:'}
                  </label>
                  <input
                    type="text"
                    value={auditGoal}
                    onChange={(e) => setAuditGoal(e.target.value)}
                    placeholder="e.g. Luxury commercial Instagram ad"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    {language === 'ar' ? 'ملاحظاتك أو ما تشك فيه:' : 'Designer Concerns:'}
                  </label>
                  <input
                    type="text"
                    value={auditDescription}
                    onChange={(e) => setAuditDescription(e.target.value)}
                    placeholder="e.g. شاكك في تباين العنوان والمسافة بين الزر والنصوص"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                onClick={handleRunRightWrongAudit}
                disabled={auditLoading || !auditMedia}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50"
              >
                {auditLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScanEye className="w-4 h-4" />}
                <span>{language === 'ar' ? 'فحص صح وغلط للعمل الفني الآن' : 'Run Right vs Wrong Audit'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {auditResult ? (
              <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6 animate-in fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0b0f17] border border-slate-800">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      {language === 'ar' ? 'حكم الآرت ديركتور الصريح' : 'Director Judgment'}
                    </span>
                    <h3 className="text-base font-bold text-white">{auditResult.verdictLabel}</h3>
                  </div>
                  <div className="text-center sm:text-end shrink-0">
                    <div className="text-4xl font-black font-mono text-emerald-400">{auditResult.score}%</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2 text-xs">
                    <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{language === 'ar' ? 'ما تم تنفيذه صح (Right):' : 'What is RIGHT:'}</span>
                    </h4>
                    <ul className="space-y-1.5 text-emerald-200/90">
                      {auditResult.whatIsRight.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2 text-xs">
                    <h4 className="font-bold text-rose-400 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" />
                      <span>{language === 'ar' ? 'ما تم تنفيذه غلط (Wrong):' : 'What is WRONG:'}</span>
                    </h4>
                    <ul className="space-y-1.5 text-rose-200/90">
                      {auditResult.whatIsWrong.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-rose-400 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col items-center justify-center text-center space-y-3 text-slate-500 min-h-[460px]">
                <ScanEye className="w-12 h-12 text-slate-600" />
                <div className="text-sm font-bold text-slate-400">
                  {language === 'ar' ? 'فاحص الآرت ديركتور بانتظار رفع ملفك' : 'Awaiting file upload for audit'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
