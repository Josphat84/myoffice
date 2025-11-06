// app/cv-builder/page.jsx
'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Trash2, 
  Download, 
  Eye, 
  Edit3,
  User,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Award,
  Star,
  Palette,
  Sparkles,
  CheckCircle2,
  Zap,
  Upload,
  Linkedin,
  Github,
  Globe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from 'jspdf';

// PDF generation function
const generatePDFDirect = (cvData, template, theme) => {
  return new Promise((resolve, reject) => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Set theme colors
      const primaryColor = theme.primary || '#3B82F6';
      const textColor = theme.text || '#1F2937';

      // Add background
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');

      let yPosition = 20;

      // Header Section
      pdf.setFillColor(parseInt(primaryColor.slice(1, 3), 16), parseInt(primaryColor.slice(3, 5), 16), parseInt(primaryColor.slice(5, 7), 16));
      pdf.rect(15, yPosition, pageWidth - 30, 50, 'F');
      
      // Name
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}`, 25, yPosition + 20);
      
      // Title
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      pdf.text(cvData.personalInfo.title || 'Professional', 25, yPosition + 30);

      yPosition += 60;

      // Contact info
      pdf.setTextColor(textColor);
      pdf.setFontSize(10);
      const contactInfo = [];
      if (cvData.personalInfo.email) contactInfo.push(`Email: ${cvData.personalInfo.email}`);
      if (cvData.personalInfo.phone) contactInfo.push(`Phone: ${cvData.personalInfo.phone}`);
      if (cvData.personalInfo.location) contactInfo.push(`Location: ${cvData.personalInfo.location}`);
      
      contactInfo.forEach((info, index) => {
        pdf.text(info, 25, yPosition + (index * 5));
      });

      yPosition += contactInfo.length * 5 + 15;

      // Summary
      if (cvData.personalInfo.summary) {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('PROFESSIONAL SUMMARY', 25, yPosition);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        const splitSummary = pdf.splitTextToSize(cvData.personalInfo.summary, pageWidth - 50);
        pdf.text(splitSummary, 25, yPosition + 8);
        yPosition += 8 + (splitSummary.length * 5) + 15;
      }

      // Experience
      if (cvData.experience.some(exp => exp.company)) {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('EXPERIENCE', 25, yPosition);
        yPosition += 10;

        cvData.experience.forEach(exp => {
          if (exp.company && yPosition < pageHeight - 50) {
            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'bold');
            pdf.text(exp.position, 25, yPosition);
            
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            pdf.text(exp.company, 25, yPosition + 5);
            
            pdf.setFontSize(9);
            const dateText = `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`;
            pdf.text(dateText, pageWidth - 25, yPosition, { align: 'right' });
            
            yPosition += 10;
            
            if (exp.description) {
              const splitDesc = pdf.splitTextToSize(exp.description, pageWidth - 50);
              pdf.text(splitDesc, 25, yPosition);
              yPosition += 5 + (splitDesc.length * 4);
            }
            
            yPosition += 10;

            // Page break check
            if (yPosition > pageHeight - 50) {
              pdf.addPage();
              yPosition = 20;
            }
          }
        });
      }

      // Education
      if (cvData.education.some(edu => edu.institution)) {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('EDUCATION', 25, yPosition);
        yPosition += 10;

        cvData.education.forEach(edu => {
          if (edu.institution && yPosition < pageHeight - 50) {
            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'bold');
            pdf.text(edu.degree, 25, yPosition);
            
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            pdf.text(edu.institution, 25, yPosition + 5);
            
            pdf.setFontSize(9);
            const dateText = `${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}`;
            pdf.text(dateText, pageWidth - 25, yPosition, { align: 'right' });
            
            yPosition += 15;

            // Page break check
            if (yPosition > pageHeight - 50) {
              pdf.addPage();
              yPosition = 20;
            }
          }
        });
      }

      // Skills
      if (cvData.skills.some(skill => skill.name) && yPosition < pageHeight - 30) {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('SKILLS', 25, yPosition);
        yPosition += 10;

        const skillsText = cvData.skills.filter(skill => skill.name).map(skill => skill.name).join(' • ');
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        const splitSkills = pdf.splitTextToSize(skillsText, pageWidth - 50);
        pdf.text(splitSkills, 25, yPosition);
      }

      resolve(pdf);
    } catch (error) {
      reject(error);
    }
  });
};

export default function CVBuilderPage() {
  const [activeTab, setActiveTab] = useState('editor');
  const [template, setTemplate] = useState('modern');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [theme, setTheme] = useState({
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    accent: '#10B981',
    background: '#FFFFFF',
    text: '#1F2937'
  });
  const [cvData, setCvData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
      summary: '',
      title: '',
      photo: null
    },
    experience: [
      {
        id: Date.now(),
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      }
    ],
    education: [
      {
        id: Date.now(),
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        current: false,
        gpa: ''
      }
    ],
    skills: [{ name: '', level: 50 }],
    languages: [{ language: '', proficiency: 'Beginner' }],
    projects: [
      {
        id: Date.now(),
        name: '',
        description: '',
        technologies: '',
        link: ''
      }
    ]
  });

  const fileInputRef = useRef();
  const { toast } = useToast();

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type.includes('image')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCvData(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            photo: e.target.result
          }
        }));
        toast({
          title: 'Photo Uploaded',
          description: 'Profile photo added successfully',
        });
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: 'File Uploaded',
        description: 'File processing would be implemented here',
      });
    }
  };

  // Add new section items
  const addExperience = () => {
    setCvData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Date.now(),
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          current: false,
          description: ''
        }
      ]
    }));
  };

  const addEducation = () => {
    setCvData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now(),
          institution: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          current: false,
          gpa: ''
        }
      ]
    }));
  };

  const addSkill = () => {
    setCvData(prev => ({
      ...prev,
      skills: [
        ...prev.skills,
        { name: '', level: 50 }
      ]
    }));
  };

  const addLanguage = () => {
    setCvData(prev => ({
      ...prev,
      languages: [
        ...prev.languages,
        { language: '', proficiency: 'Beginner' }
      ]
    }));
  };

  const addProject = () => {
    setCvData(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: Date.now(),
          name: '',
          description: '',
          technologies: '',
          link: ''
        }
      ]
    }));
  };

  // Remove section items
  const removeExperience = (id) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const removeEducation = (id) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const removeSkill = (index) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const removeLanguage = (index) => {
    setCvData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  const removeProject = (id) => {
    setCvData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== id)
    }));
  };

  // Update functions
  const updatePersonalInfo = (field, value) => {
    setCvData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const updateExperience = (id, field, value) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const updateEducation = (id, field, value) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const updateSkill = (index, field, value) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const updateLanguage = (index, field, value) => {
    setCvData(prev => ({
      ...prev,
      languages: prev.languages.map((lang, i) => 
        i === index ? { ...lang, [field]: value } : lang
      )
    }));
  };

  const updateProject = (id, field, value) => {
    setCvData(prev => ({
      ...prev,
      projects: prev.projects.map(project => 
        project.id === id ? { ...project, [field]: value } : project
      )
    }));
  };

  // Direct PDF download
  const downloadPDF = async () => {
    if (!cvData.personalInfo.firstName || !cvData.personalInfo.lastName) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in at least your first and last name',
        variant: 'destructive',
      });
      return;
    }

    setIsGeneratingPDF(true);
    try {
      const pdf = await generatePDFDirect(cvData, template, theme);
      pdf.save(`${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}_CV.pdf`);
      toast({
        title: '✅ CV Downloaded!',
        description: 'Your professional CV has been saved',
      });
    } catch (error) {
      console.error('PDF Generation Error:', error);
      toast({
        title: '❌ Download Failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Calculate completion percentage
  const completionPercentage = () => {
    let completed = 0;
    let total = 0;

    // Personal info
    const personalFields = ['firstName', 'lastName', 'email', 'title'];
    personalFields.forEach(field => {
      total++;
      if (cvData.personalInfo[field]) completed++;
    });

    // Experience
    cvData.experience.forEach(exp => {
      ['company', 'position'].forEach(field => {
        total++;
        if (exp[field]) completed++;
      });
    });

    // Education
    cvData.education.forEach(edu => {
      ['institution', 'degree'].forEach(field => {
        total++;
        if (edu[field]) completed++;
      });
    });

    // Skills
    total += cvData.skills.length;
    completed += cvData.skills.filter(skill => skill.name).length;

    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  // Theme presets
  const themePresets = {
    blue: { primary: '#3B82F6', secondary: '#1E40AF', accent: '#60A5FA', background: '#FFFFFF', text: '#1F2937' },
    green: { primary: '#10B981', secondary: '#047857', accent: '#34D399', background: '#FFFFFF', text: '#1F2937' },
    purple: { primary: '#8B5CF6', secondary: '#7C3AED', accent: '#A78BFA', background: '#FFFFFF', text: '#1F2937' }
  };

  // Modern CV Template
  const ModernCV = () => (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        {cvData.personalInfo.photo && (
          <img 
            src={cvData.personalInfo.photo} 
            alt="Profile" 
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-gray-200"
          />
        )}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {cvData.personalInfo.firstName} {cvData.personalInfo.lastName}
        </h1>
        <p className="text-xl text-gray-600 mb-4">{cvData.personalInfo.title}</p>
        <p className="text-gray-600 max-w-2xl mx-auto">{cvData.personalInfo.summary}</p>
        
        {/* Contact Links */}
        <div className="flex justify-center gap-6 mt-4 flex-wrap">
          {cvData.personalInfo.email && (
            <a href={`mailto:${cvData.personalInfo.email}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
              <Mail className="h-4 w-4" />
              {cvData.personalInfo.email}
            </a>
          )}
          {cvData.personalInfo.phone && (
            <a href={`tel:${cvData.personalInfo.phone}`} className="flex items-center gap-2 text-green-600 hover:text-green-700">
              <Phone className="h-4 w-4" />
              {cvData.personalInfo.phone}
            </a>
          )}
          {cvData.personalInfo.location && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              {cvData.personalInfo.location}
            </div>
          )}
          {cvData.personalInfo.linkedin && (
            <a href={cvData.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-700 hover:text-blue-800">
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
          )}
          {cvData.personalInfo.github && (
            <a href={cvData.personalInfo.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 hover:text-gray-800">
              <Github className="h-4 w-4" />
              GitHub
            </a>
          )}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          {/* Experience */}
          {cvData.experience.some(exp => exp.company) && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-blue-500 pb-2">
                Professional Experience
              </h2>
              <div className="space-y-6">
                {cvData.experience.map((exp) => (
                  exp.company && (
                    <div key={exp.id} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{exp.position}</h3>
                          <p className="text-blue-600 font-semibold">{exp.company}</p>
                        </div>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      <p className="text-gray-600">{exp.description}</p>
                    </div>
                  )
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {cvData.education.some(edu => edu.institution) && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-green-500 pb-2">
                Education
              </h2>
              <div className="space-y-6">
                {cvData.education.map((edu) => (
                  edu.institution && (
                    <div key={edu.id} className="border-l-4 border-green-500 pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{edu.degree}</h3>
                          <p className="text-green-600 font-semibold">{edu.institution}</p>
                          {edu.field && <p className="text-gray-600">{edu.field}</p>}
                          {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
                        </div>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                        </span>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {cvData.projects.some(project => project.name) && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-purple-500 pb-2">
                Projects
              </h2>
              <div className="space-y-6">
                {cvData.projects.map((project) => (
                  project.name && (
                    <div key={project.id} className="border-l-4 border-purple-500 pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{project.name}</h3>
                          {project.technologies && (
                            <div className="flex flex-wrap gap-2 mt-1">
                              {project.technologies.split(',').map((tech, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tech.trim()}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        {project.link && (
                          <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 hover:text-purple-700">
                            View Project
                          </a>
                        )}
                      </div>
                      <p className="text-gray-600">{project.description}</p>
                    </div>
                  )
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-8">
          {/* Skills */}
          {cvData.skills.some(skill => skill.name) && (
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Skills</h3>
              <div className="space-y-3">
                {cvData.skills.map((skill, index) => (
                  skill.name && (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700">{skill.name}</span>
                        <span className="text-gray-500">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  )
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {cvData.languages.some(lang => lang.language) && (
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Languages</h3>
              <div className="space-y-2">
                {cvData.languages.map((lang, index) => (
                  lang.language && (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-700">{lang.language}</span>
                      <Badge variant="secondary">{lang.proficiency}</Badge>
                    </div>
                  )
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Professional CV Builder
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create, customize, and download your perfect CV
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8 border-blue-200 bg-blue-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-gray-700">CV Completion</span>
              </div>
              <span className="text-sm font-bold text-blue-600">{completionPercentage()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-1000"
                style={{ width: `${completionPercentage()}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-white/80 border border-gray-200 p-1 rounded-2xl">
            <TabsTrigger value="editor" className="flex items-center gap-3 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg">
              <Edit3 className="h-4 w-4" />
              <span className="font-semibold">Editor</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-3 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg">
              <Eye className="h-4 w-4" />
              <span className="font-semibold">Preview</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="xl:col-span-1 space-y-6">
                {/* Upload Section */}
                <Card className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <Upload className="h-5 w-5 text-blue-600" />
                      Import CV
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,image/*"
                      className="hidden"
                    />
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline" 
                      className="w-full border-blue-200"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload CV/Photo
                    </Button>
                    <p className="text-xs text-gray-500 text-center">
                      Upload your existing CV or profile photo
                    </p>
                  </CardContent>
                </Card>

                {/* Template & Theme */}
                <Card className="border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <Palette className="h-5 w-5 text-purple-600" />
                      Design
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Template</Label>
                      <Select value={template} onValueChange={setTemplate}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="modern">Modern</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="creative">Creative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Color Theme</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(themePresets).map(([name, colors]) => (
                          <button
                            key={name}
                            onClick={() => setTheme(colors)}
                            className={`h-10 rounded-lg border-2 ${
                              theme.primary === colors.primary ? 'border-gray-400' : 'border-gray-200'
                            }`}
                            style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
                            title={name.charAt(0).toUpperCase() + name.slice(1)}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <Zap className="h-5 w-5 text-green-600" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      onClick={downloadPDF}
                      disabled={isGeneratingPDF}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      size="lg"
                    >
                      {isGeneratingPDF ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('preview')} 
                      variant="outline" 
                      className="w-full border-green-200 text-green-700 hover:bg-green-50"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Live Preview
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Main Editor */}
              <div className="xl:col-span-3 space-y-6">
                {/* Personal Information */}
                <Card className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <User className="h-6 w-6 text-blue-600" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Photo Upload */}
                    <div className="flex items-center gap-6">
                      <div className="flex-shrink-0">
                        {cvData.personalInfo.photo ? (
                          <img 
                            src={cvData.personalInfo.photo} 
                            alt="Profile" 
                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <User className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <Button 
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline" 
                        size="sm"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {cvData.personalInfo.photo ? 'Change Photo' : 'Upload Photo'}
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>First Name *</Label>
                        <Input
                          value={cvData.personalInfo.firstName}
                          onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                          placeholder="John"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Last Name *</Label>
                        <Input
                          value={cvData.personalInfo.lastName}
                          onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Professional Title</Label>
                      <Input
                        value={cvData.personalInfo.title}
                        onChange={(e) => updatePersonalInfo('title', e.target.value)}
                        placeholder="Senior Software Engineer"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Professional Summary</Label>
                      <Textarea
                        value={cvData.personalInfo.summary}
                        onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                        placeholder="Describe your professional background, skills, and career objectives..."
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={cvData.personalInfo.email}
                          onChange={(e) => updatePersonalInfo('email', e.target.value)}
                          placeholder="john@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={cvData.personalInfo.phone}
                          onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        value={cvData.personalInfo.location}
                        onChange={(e) => updatePersonalInfo('location', e.target.value)}
                        placeholder="New York, NY"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>
                          <Linkedin className="h-4 w-4 inline mr-2 text-blue-700" />
                          LinkedIn
                        </Label>
                        <Input
                          value={cvData.personalInfo.linkedin}
                          onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>
                          <Github className="h-4 w-4 inline mr-2 text-gray-700" />
                          GitHub
                        </Label>
                        <Input
                          value={cvData.personalInfo.github}
                          onChange={(e) => updatePersonalInfo('github', e.target.value)}
                          placeholder="https://github.com/username"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Experience Section */}
                <Card className="border-orange-200">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xl">
                        <Briefcase className="h-6 w-6 text-orange-600" />
                        Work Experience
                      </div>
                      <Button onClick={addExperience}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Experience
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {cvData.experience.map((exp) => (
                      <div key={exp.id} className="space-y-4 p-4 border border-orange-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-lg text-orange-900">
                            Experience {cvData.experience.findIndex(e => e.id === exp.id) + 1}
                          </h4>
                          {cvData.experience.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeExperience(exp.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Company</Label>
                            <Input
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                              placeholder="Google"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Position</Label>
                            <Input
                              value={exp.position}
                              onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                              placeholder="Senior Developer"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input
                              type="month"
                              value={exp.startDate}
                              onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>End Date</Label>
                            <div className="flex items-center gap-4">
                              <Input
                                type="month"
                                value={exp.endDate}
                                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                disabled={exp.current}
                              />
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={exp.current}
                                  onCheckedChange={(checked) => updateExperience(exp.id, 'current', checked)}
                                />
                                <Label className="text-sm">Current</Label>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={exp.description}
                            onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                            placeholder="Describe your responsibilities and achievements..."
                            rows={3}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Education Section */}
                <Card className="border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xl">
                        <GraduationCap className="h-6 w-6 text-green-600" />
                        Education
                      </div>
                      <Button onClick={addEducation}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Education
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {cvData.education.map((edu) => (
                      <div key={edu.id} className="space-y-4 p-4 border border-green-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-lg text-green-900">
                            Education {cvData.education.findIndex(e => e.id === edu.id) + 1}
                          </h4>
                          {cvData.education.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEducation(edu.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Institution</Label>
                            <Input
                              value={edu.institution}
                              onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                              placeholder="University of Technology"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Degree</Label>
                            <Input
                              value={edu.degree}
                              onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                              placeholder="Bachelor of Science"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Field of Study</Label>
                          <Input
                            value={edu.field}
                            onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                            placeholder="Computer Science"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input
                              type="month"
                              value={edu.startDate}
                              onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>End Date</Label>
                            <div className="flex items-center gap-4">
                              <Input
                                type="month"
                                value={edu.endDate}
                                onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                                disabled={edu.current}
                              />
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={edu.current}
                                  onCheckedChange={(checked) => updateEducation(edu.id, 'current', checked)}
                                />
                                <Label className="text-sm">Current</Label>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>GPA</Label>
                          <Input
                            value={edu.gpa}
                            onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                            placeholder="3.8"
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Skills Section */}
                <Card className="border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xl">
                        <Award className="h-6 w-6 text-purple-600" />
                        Skills
                      </div>
                      <Button onClick={addSkill}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Skill
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cvData.skills.map((skill, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 border border-purple-200 rounded-lg">
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Skill Name</Label>
                            <Input
                              value={skill.name}
                              onChange={(e) => updateSkill(index, 'name', e.target.value)}
                              placeholder="React, Python, Project Management"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Proficiency Level</Label>
                            <div className="flex items-center gap-4">
                              <Input
                                type="range"
                                min="0"
                                max="100"
                                value={skill.level}
                                onChange={(e) => updateSkill(index, 'level', parseInt(e.target.value))}
                                className="w-full"
                              />
                              <span className="text-sm font-medium w-12">{skill.level}%</span>
                            </div>
                          </div>
                        </div>
                        {cvData.skills.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSkill(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Languages Section */}
                <Card className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xl">
                        <Globe className="h-6 w-6 text-blue-600" />
                        Languages
                      </div>
                      <Button onClick={addLanguage}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Language
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cvData.languages.map((lang, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 border border-blue-200 rounded-lg">
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Language</Label>
                            <Input
                              value={lang.language}
                              onChange={(e) => updateLanguage(index, 'language', e.target.value)}
                              placeholder="English, Spanish, French..."
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Proficiency</Label>
                            <Select value={lang.proficiency} onValueChange={(value) => updateLanguage(index, 'proficiency', value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Beginner">Beginner</SelectItem>
                                <SelectItem value="Intermediate">Intermediate</SelectItem>
                                <SelectItem value="Advanced">Advanced</SelectItem>
                                <SelectItem value="Native">Native</SelectItem>
                                <SelectItem value="Fluent">Fluent</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        {cvData.languages.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLanguage(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Projects Section */}
                <Card className="border-indigo-200">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xl">
                        <Star className="h-6 w-6 text-indigo-600" />
                        Projects
                      </div>
                      <Button onClick={addProject}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Project
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {cvData.projects.map((project) => (
                      <div key={project.id} className="space-y-4 p-4 border border-indigo-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-lg text-indigo-900">
                            Project {cvData.projects.findIndex(p => p.id === project.id) + 1}
                          </h4>
                          {cvData.projects.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeProject(project.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Project Name</Label>
                          <Input
                            value={project.name}
                            onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                            placeholder="E-commerce Website"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={project.description}
                            onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                            placeholder="Describe the project, your role, and key achievements..."
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Technologies Used</Label>
                          <Input
                            value={project.technologies}
                            onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                            placeholder="React, Node.js, MongoDB, AWS"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Project Link (Optional)</Label>
                          <Input
                            value={project.link}
                            onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                            placeholder="https://github.com/username/project"
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-8">
            <div className="flex justify-center">
              <ModernCV />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}