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
  Upload,
  Linkedin,
  Github,
  RefreshCw,
  FileText,
  Scan
} from 'lucide-react';

// Simple toast implementation
const useToast = () => {
  const showToast = (title, description, variant = 'default') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
      variant === 'destructive' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
    }`;
    toast.innerHTML = `
      <div class="font-semibold">${title}</div>
      <div class="text-sm opacity-90">${description}</div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3000);
  };

  return { toast: showToast };
};

// Generate unique IDs
const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${performance.now().toString(36).replace('.', '')}`;
};

// Enhanced CV Parser with proper file type handling
const parseUploadedCV = async (file) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('Processing file:', file.name, file.type);
      
      let extractedText = '';
      const fileName = file.name.toLowerCase();

      // Handle different file types
      if (fileName.endsWith('.pdf')) {
        extractedText = await parsePDF(file);
      } else if (fileName.endsWith('.docx')) {
        extractedText = await parseDOCX(file);
      } else if (fileName.endsWith('.doc')) {
        extractedText = await parseDOC(file);
      } else if (fileName.endsWith('.txt') || file.type === 'text/plain') {
        extractedText = await parseTXT(file);
      } else {
        throw new Error('Unsupported file format. Please upload PDF, Word, or Text files.');
      }

      console.log('Extracted text length:', extractedText.length);
      console.log('First 500 chars:', extractedText.substring(0, 500));

      const parsedData = advancedTextParser(extractedText);
      resolve(parsedData);

    } catch (error) {
      console.error('CV parsing error:', error);
      reject(error);
    }
  });
};

// PDF parsing
const parsePDF = async (file) => {
  return new Promise(async (resolve, reject) => {
    try {
      const pdfParse = (await import('pdf-parse')).default;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      
      const data = await pdfParse(buffer);
      resolve(data.text);
    } catch (error) {
      reject(new Error(`PDF parsing failed: ${error.message}`));
    }
  });
};

// DOCX parsing
const parseDOCX = async (file) => {
  return new Promise(async (resolve, reject) => {
    try {
      const mammoth = (await import('mammoth')).default;
      const arrayBuffer = await file.arrayBuffer();
      
      const result = await mammoth.extractRawText({ arrayBuffer });
      resolve(result.value);
    } catch (error) {
      reject(new Error(`DOCX parsing failed: ${error.message}`));
    }
  });
};

// DOC file handling (basic fallback)
const parseDOC = async (file) => {
  return new Promise((resolve) => {
    // .doc files are complex - provide guidance
    resolve("DOC file detected. For better parsing, please save as PDF or DOCX, or copy-paste the content into a text file.");
  });
};

// Text file parsing
const parseTXT = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read text file'));
    reader.readAsText(file);
  });
};

// Advanced text parser with better pattern matching
const advancedTextParser = (text) => {
  // Clean and normalize text
  const cleanText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = cleanText.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  console.log('Lines found:', lines.length);
  console.log('First 10 lines:', lines.slice(0, 10));

  const parsedData = {
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
      title: '',
      linkedin: '',
      github: ''
    },
    experience: [],
    education: [],
    skills: [],
    languages: [],
    projects: []
  };

  // Extract email - multiple patterns
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emailMatches = text.match(emailRegex);
  if (emailMatches && emailMatches.length > 0) {
    parsedData.personalInfo.email = emailMatches[0];
    console.log('Found email:', parsedData.personalInfo.email);
  }

  // Extract phone - multiple international formats
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const phoneMatches = text.match(phoneRegex);
  if (phoneMatches && phoneMatches.length > 0) {
    parsedData.personalInfo.phone = phoneMatches[0];
    console.log('Found phone:', parsedData.personalInfo.phone);
  }

  // Name extraction - look for title case words in first few lines
  if (lines.length > 0) {
    const potentialNameLines = lines.slice(0, 3);
    for (const line of potentialNameLines) {
      const words = line.split(/\s+/).filter(word => word.length > 1);
      if (words.length >= 2 && words.length <= 4) {
        // Check if line looks like a name (title case, no special characters)
        const looksLikeName = words.every(word => 
          /^[A-Z][a-z]*$/.test(word) || /^[A-Z]\.?$/.test(word)
        );
        
        if (looksLikeName) {
          parsedData.personalInfo.firstName = words[0];
          parsedData.personalInfo.lastName = words.slice(1).join(' ');
          console.log('Found name:', parsedData.personalInfo.firstName, parsedData.personalInfo.lastName);
          break;
        }
      }
    }
  }

  // Title extraction - look after name or in first 5 lines
  if (lines.length > 1) {
    for (let i = 1; i < Math.min(6, lines.length); i++) {
      const line = lines[i];
      if (line && line.length > 3 && line.length < 100 && 
          !line.includes('@') && !/\d{10,}/.test(line)) {
        parsedData.personalInfo.title = line;
        console.log('Found title:', parsedData.personalInfo.title);
        break;
      }
    }
  }

  // Location extraction
  const locationRegex = /([A-Z][a-zA-Z\s]+,?\s*(?:[A-Z]{2,3}\s*)?\d{0,5})|(Remote|Hybrid|On-site)/gi;
  const locationMatches = text.match(locationRegex);
  if (locationMatches) {
    // Filter out false positives
    const validLocations = locationMatches.filter(loc => 
      loc.length > 3 && 
      !loc.match(/^[A-Z]$/) && 
      !loc.includes('@')
    );
    if (validLocations.length > 0) {
      parsedData.personalInfo.location = validLocations[0];
      console.log('Found location:', parsedData.personalInfo.location);
    }
  }

  // Summary extraction - first substantial paragraph
  let summary = '';
  for (const line of lines) {
    if (line.length > 50 && line.length < 500 && 
        !line.includes('@') && !/\d{10,}/.test(line) &&
        !line.toLowerCase().includes('experience') &&
        !line.toLowerCase().includes('education') &&
        !line.toLowerCase().includes('skill')) {
      summary = line;
      break;
    }
  }
  
  if (!summary && lines.length > 0) {
    // Fallback: use first meaningful line
    for (const line of lines) {
      if (line.length > 20 && line.length < 200) {
        summary = line;
        break;
      }
    }
  }
  
  parsedData.personalInfo.summary = summary || 'Professional with extensive experience.';
  console.log('Found summary:', parsedData.personalInfo.summary);

  // Skills extraction with comprehensive list
  const skillKeywords = [
    // Programming Languages
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
    'HTML', 'CSS', 'SQL', 'NoSQL', 'GraphQL',
    
    // Frameworks & Libraries
    'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel', 'Ruby on Rails',
    'jQuery', 'Bootstrap', 'Tailwind', 'Sass', 'Less',
    
    // Tools & Platforms
    'Git', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Firebase', 'MongoDB', 'PostgreSQL', 'MySQL',
    'Redis', 'Jenkins', 'CI/CD', 'REST API', 'GraphQL', 'Microservices',
    
    // Soft Skills
    'Communication', 'Leadership', 'Problem Solving', 'Project Management', 'Teamwork', 'Collaboration',
    'Agile', 'Scrum', 'Kanban', 'Time Management', 'Critical Thinking', 'Creativity'
  ];

  const foundSkills = [];
  const textLower = text.toLowerCase();
  
  skillKeywords.forEach(skill => {
    if (textLower.includes(skill.toLowerCase())) {
      foundSkills.push({ 
        name: skill, 
        level: Math.floor(Math.random() * 25) + 75 // 75-100%
      });
    }
  });

  // If no skills found, add some intelligent defaults based on context
  if (foundSkills.length === 0) {
    if (textLower.includes('developer') || textLower.includes('engineer')) {
      foundSkills.push(
        { name: 'Problem Solving', level: 85 },
        { name: 'Technical Skills', level: 80 },
        { name: 'Team Collaboration', level: 75 }
      );
    } else {
      foundSkills.push(
        { name: 'Communication', level: 80 },
        { name: 'Problem Solving', level: 75 },
        { name: 'Project Management', level: 70 }
      );
    }
  }

  parsedData.skills = foundSkills;
  console.log('Found skills:', foundSkills.map(s => s.name));

  // Extract experience sections (basic)
  const experienceKeywords = ['experience', 'work history', 'employment', 'professional background'];
  let inExperienceSection = false;
  let currentExperience = null;

  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    
    // Start of experience section
    if (experienceKeywords.some(keyword => lowerLine.includes(keyword))) {
      inExperienceSection = true;
      continue;
    }

    if (inExperienceSection) {
      // Look for company patterns
      if (line.length > 2 && line.length < 100 && 
          !line.includes('@') && !/\d{10,}/.test(line)) {
        
        // If we have a current experience, save it
        if (currentExperience && currentExperience.company) {
          parsedData.experience.push(currentExperience);
        }
        
        // Start new experience
        currentExperience = {
          id: generateUniqueId(),
          company: line,
          position: '',
          startDate: '',
          endDate: '',
          current: false,
          description: ''
        };
      }
      
      // Look for position patterns (often follows company)
      if (currentExperience && !currentExperience.position && line.length > 5) {
        currentExperience.position = line;
      }
    }
  }

  // Add the last experience if exists
  if (currentExperience && currentExperience.company) {
    parsedData.experience.push(currentExperience);
  }

  console.log('Found experiences:', parsedData.experience.length);

  return parsedData;
};

// Enhanced PDF Generation with Magazine-Level Design
const generatePDF = async (cvData, theme) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { jsPDF } = await import('jspdf');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Magazine-inspired color scheme
      const primaryColor = [59, 130, 246]; // Blue
      const secondaryColor = [139, 92, 246]; // Purple
      const accentColor = [16, 185, 129]; // Emerald
      const darkColor = [30, 41, 59]; // Slate-800
      const lightColor = [248, 250, 252]; // Slate-50
      const grayColor = [100, 116, 139]; // Slate-500

      // Helper function to add section with modern design
      const addModernSection = (title, contentY, contentCallback) => {
        // Section header with accent bar
        pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.rect(20, contentY - 8, 4, 16, 'F');
        
        pdf.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(title.toUpperCase(), 30, contentY + 2);
        
        // Subtle underline
        pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.setLineWidth(0.5);
        pdf.line(30, contentY + 4, pageWidth - 20, contentY + 4);
        
        return contentCallback(contentY + 12);
      };

      // Add subtle background pattern
      pdf.setFillColor(lightColor[0], lightColor[1], lightColor[2]);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');

      // Modern Header with gradient effect
      const headerHeight = 45;
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.rect(0, 0, pageWidth, headerHeight, 'F');
      
      // Add subtle pattern to header
      pdf.setFillColor(255, 255, 255, 0.1);
      for (let i = 0; i < pageWidth; i += 8) {
        pdf.rect(i, 0, 4, headerHeight, 'F');
      }

      // Name and title in header
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      
      const nameText = `${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}`;
      const nameWidth = pdf.getTextWidth(nameText);
      const nameX = (pageWidth - nameWidth) / 2;
      
      pdf.text(nameText, nameX, 20);
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      const titleText = cvData.personalInfo.title || 'Professional';
      const titleWidth = pdf.getTextWidth(titleText);
      const titleX = (pageWidth - titleWidth) / 2;
      pdf.text(titleText, titleX, 30);

      // Profile photo with modern styling
      if (cvData.personalInfo.photo) {
        try {
          const photoSize = 32;
          const photoX = pageWidth - 45;
          const photoY = 6;
          
          // Circular photo with border and shadow effect
          pdf.setFillColor(255, 255, 255);
          pdf.circle(photoX + photoSize/2, photoY + photoSize/2, photoSize/2 + 1, 'F');
          pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          pdf.setLineWidth(1.5);
          pdf.circle(photoX + photoSize/2, photoY + photoSize/2, photoSize/2 + 1, 'S');
          
          pdf.addImage(cvData.personalInfo.photo, 'JPEG', photoX, photoY, photoSize, photoSize, 'circle');
        } catch (imgError) {
          console.warn('Could not add image to PDF:', imgError);
        }
      }

      let yPosition = 55;

      // Contact Information - Modern badge style
      const contactItems = [];
      if (cvData.personalInfo.email) contactItems.push({ text: cvData.personalInfo.email, icon: '✉️' });
      if (cvData.personalInfo.phone) contactItems.push({ text: cvData.personalInfo.phone, icon: '📞' });
      if (cvData.personalInfo.location) contactItems.push({ text: cvData.personalInfo.location, icon: '📍' });
      if (cvData.personalInfo.linkedin) contactItems.push({ text: 'LinkedIn', icon: '💼', url: cvData.personalInfo.linkedin });
      if (cvData.personalInfo.github) contactItems.push({ text: 'GitHub', icon: '⚡', url: cvData.personalInfo.github });

      if (contactItems.length > 0) {
        pdf.setFontSize(9);
        pdf.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
        
        const badgeHeight = 6;
        const badgePadding = 8;
        let badgeX = 20;
        
        contactItems.forEach((item, index) => {
          const badgeText = `${item.icon} ${item.text}`;
          const badgeWidth = pdf.getTextWidth(badgeText) + badgePadding * 2;
          
          // Check if we need to wrap to next line
          if (badgeX + badgeWidth > pageWidth - 20) {
            badgeX = 20;
            yPosition += badgeHeight + 4;
          }
          
          // Badge background
          pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2], 0.1);
          pdf.roundedRect(badgeX, yPosition, badgeWidth, badgeHeight, 3, 3, 'F');
          
          // Badge border
          pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2], 0.3);
          pdf.setLineWidth(0.3);
          pdf.roundedRect(badgeX, yPosition, badgeWidth, badgeHeight, 3, 3, 'S');
          
          // Badge text
          pdf.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
          pdf.text(badgeText, badgeX + badgePadding, yPosition + 4);
          
          badgeX += badgeWidth + 6;
        });
        
        yPosition += badgeHeight + 16;
      }

      // Professional Summary with modern card design
      if (cvData.personalInfo.summary) {
        yPosition = addModernSection('Professional Profile', yPosition, (startY) => {
          // Summary card with subtle background
          pdf.setFillColor(255, 255, 255);
          pdf.setDrawColor(grayColor[0], grayColor[1], grayColor[2], 0.2);
          pdf.setLineWidth(0.5);
          pdf.roundedRect(20, startY, pageWidth - 40, 30, 3, 3, 'FD');
          
          pdf.setFontSize(10);
          pdf.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
          pdf.setFont('helvetica', 'normal');
          
          const splitSummary = pdf.splitTextToSize(cvData.personalInfo.summary, pageWidth - 60);
          pdf.text(splitSummary, 30, startY + 8);
          
          return startY + 35;
        });
      }

      // Two-column layout for main content
      const col1X = 20;
      const col2X = pageWidth / 2 + 10;
      const colWidth = (pageWidth - 50) / 2;
      let col1Y = yPosition;
      let col2Y = yPosition;

      // Experience Section
      if (cvData.experience.length > 0) {
        col1Y = addModernSection('Professional Experience', col1Y, (startY) => {
          let currentY = startY;
          
          cvData.experience.forEach((exp, index) => {
            if (exp.company && currentY < pageHeight - 50) {
              // Add page break if needed
              if (currentY > pageHeight - 80 && index > 0) {
                pdf.addPage();
                currentY = 30;
              }

              // Experience card
              pdf.setFillColor(255, 255, 255, 0.8);
              pdf.setDrawColor(grayColor[0], grayColor[1], grayColor[2], 0.1);
              pdf.roundedRect(col1X, currentY, colWidth, 35, 2, 2, 'FD');

              // Position and Company
              pdf.setFontSize(11);
              pdf.setFont('helvetica', 'bold');
              pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
              pdf.text(exp.position || 'Position', col1X + 8, currentY + 8);
              
              pdf.setFontSize(9);
              pdf.setFont('helvetica', 'bold');
              pdf.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
              pdf.text(exp.company, col1X + 8, currentY + 14);
              
              // Dates with modern styling
              pdf.setFontSize(8);
              pdf.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
              const dateText = exp.startDate ? `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}` : '';
              pdf.text(dateText, col1X + 8, currentY + 20);
              
              // Description with better typography
              if (exp.description) {
                pdf.setFontSize(8);
                pdf.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
                const splitDesc = pdf.splitTextToSize(exp.description, colWidth - 16);
                pdf.text(splitDesc, col1X + 8, currentY + 26);
                currentY += splitDesc.length * 3 + 10;
              } else {
                currentY += 20;
              }
              
              currentY += 25;
              
              // Add subtle separator between experiences
              if (index < cvData.experience.length - 1) {
                pdf.setDrawColor(grayColor[0], grayColor[1], grayColor[2], 0.2);
                pdf.setLineWidth(0.3);
                pdf.line(col1X + 10, currentY - 5, col1X + colWidth - 10, currentY - 5);
                currentY += 8;
              }
            }
          });
          
          return Math.max(currentY, col1Y);
        });
      }

      // Education Section
      if (cvData.education.length > 0) {
        col2Y = addModernSection('Education', col2Y, (startY) => {
          let currentY = startY;
          
          cvData.education.forEach((edu, index) => {
            if (edu.institution && currentY < pageHeight - 40) {
              // Education card
              pdf.setFillColor(255, 255, 255, 0.8);
              pdf.setDrawColor(grayColor[0], grayColor[1], grayColor[2], 0.1);
              pdf.roundedRect(col2X, currentY, colWidth, 28, 2, 2, 'FD');

              // Degree and Institution
              pdf.setFontSize(10);
              pdf.setFont('helvetica', 'bold');
              pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
              pdf.text(edu.degree || 'Degree', col2X + 8, currentY + 8);
              
              pdf.setFontSize(8);
              pdf.setFont('helvetica', 'bold');
              pdf.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
              pdf.text(edu.institution, col2X + 8, currentY + 14);
              
              // Field and GPA
              pdf.setFontSize(7);
              pdf.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
              let details = [];
              if (edu.field) details.push(edu.field);
              if (edu.gpa) details.push(`GPA: ${edu.gpa}`);
              
              if (details.length > 0) {
                pdf.text(details.join(' • '), col2X + 8, currentY + 20);
              }
              
              currentY += 35;
            }
          });
          
          return Math.max(currentY, col2Y);
        });
      }

      // Skills Section with modern progress bars
      if (cvData.skills.length > 0) {
        const skillsStartY = Math.max(col1Y, col2Y) + 10;
        
        col1Y = addModernSection('Technical Skills', skillsStartY, (startY) => {
          let currentY = startY;
          
          // Skills in a modern grid layout
          const skillsPerColumn = Math.ceil(cvData.skills.length / 2);
          const skillItemHeight = 12;
          
          cvData.skills.forEach((skill, index) => {
            if (skill.name) {
              const col = index < skillsPerColumn ? 0 : 1;
              const xPos = col === 0 ? col1X : col1X + colWidth / 2 + 5;
              const row = col === 0 ? index : index - skillsPerColumn;
              
              // Skill name
              pdf.setFontSize(9);
              pdf.setFont('helvetica', 'bold');
              pdf.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
              pdf.text(skill.name, xPos, currentY + (row * skillItemHeight));
              
              // Progress bar background
              pdf.setFillColor(grayColor[0], grayColor[1], grayColor[2], 0.2);
              pdf.roundedRect(xPos + 35, currentY + (row * skillItemHeight) - 3, 40, 4, 2, 2, 'F');
              
              // Progress bar fill
              pdf.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
              const progressWidth = (skill.level / 100) * 40;
              pdf.roundedRect(xPos + 35, currentY + (row * skillItemHeight) - 3, progressWidth, 4, 2, 2, 'F');
              
              // Percentage
              pdf.setFontSize(7);
              pdf.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
              pdf.text(`${skill.level}%`, xPos + 78, currentY + (row * skillItemHeight));
            }
          });
          
          return currentY + (skillsPerColumn * skillItemHeight) + 10;
        });
      }

      // Languages Section
      if (cvData.languages.length > 0) {
        col2Y = addModernSection('Languages', skillsStartY, (startY) => {
          let currentY = startY;
          
          cvData.languages.forEach((lang, index) => {
            if (lang.language) {
              pdf.setFontSize(9);
              pdf.setFont('helvetica', 'bold');
              pdf.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
              pdf.text(lang.language, col2X, currentY + (index * 6));
              
              pdf.setFontSize(8);
              pdf.setFont('helvetica', 'normal');
              pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
              const proficiencyX = col2X + 30;
              pdf.text(lang.proficiency, proficiencyX, currentY + (index * 6));
            }
          });
          
          return currentY + (cvData.languages.length * 6) + 10;
        });
      }

      // Modern Footer
      pdf.setFontSize(8);
      pdf.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      pdf.setFont('helvetica', 'italic');
      
      const footerText = 'Generated with Professional CV Builder • Modern Design Template';
      const footerWidth = pdf.getTextWidth(footerText);
      const footerX = (pageWidth - footerWidth) / 2;
      
      pdf.text(footerText, footerX, pageHeight - 15);

      // Add page numbers if multiple pages
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
        pdf.text(`Page ${i} of ${pageCount}`, pageWidth - 25, pageHeight - 15);
      }

      resolve(pdf);
    } catch (error) {
      console.error('PDF generation error:', error);
      reject(error);
    }
  });
};

// CV Preview Component
const CVPreview = ({ cvData, theme }) => (
  <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 max-w-4xl mx-auto">
    <div className="rounded-xl p-6 text-white mb-6" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}>
      <div className="flex items-start gap-4">
        {cvData.personalInfo.photo && (
          <img src={cvData.personalInfo.photo} alt="Profile" className="w-20 h-20 rounded-xl object-cover border-2 border-white/30" />
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{cvData.personalInfo.firstName} {cvData.personalInfo.lastName}</h1>
          <p className="text-xl font-semibold mb-3 opacity-90">{cvData.personalInfo.title}</p>
          <p className="opacity-80 leading-relaxed">{cvData.personalInfo.summary}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-white/30">
        {cvData.personalInfo.email && <div className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4" />{cvData.personalInfo.email}</div>}
        {cvData.personalInfo.phone && <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4" />{cvData.personalInfo.phone}</div>}
        {cvData.personalInfo.location && <div className="flex items-center gap-2 text-sm"><MapPin className="w-4 h-4" />{cvData.personalInfo.location}</div>}
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {cvData.experience.some(exp => exp.company) && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 pb-2" style={{ borderColor: theme.primary }}>Professional Experience</h2>
            <div className="space-y-4">
              {cvData.experience.map((exp) => exp.company && (
                <div key={exp.id} className="border-l-4 pl-4" style={{ borderColor: theme.primary }}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{exp.position}</h3>
                      <p className="font-semibold" style={{ color: theme.primary }}>{exp.company}</p>
                    </div>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
        {cvData.education.some(edu => edu.institution) && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 pb-2" style={{ borderColor: theme.accent }}>Education</h2>
            <div className="space-y-4">
              {cvData.education.map((edu) => edu.institution && (
                <div key={edu.id} className="border-l-4 pl-4" style={{ borderColor: theme.accent }}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{edu.degree}</h3>
                      <p className="font-semibold" style={{ color: theme.accent }}>{edu.institution}</p>
                      {edu.field && <p className="text-gray-600 text-sm">{edu.field}</p>}
                      {edu.gpa && <p className="text-gray-500 text-sm mt-1">GPA: {edu.gpa}</p>}
                    </div>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
      <div className="space-y-6">
        {cvData.skills.some(skill => skill.name) && (
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Skills</h3>
            <div className="space-y-3">
              {cvData.skills.map((skill, index) => skill.name && (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{skill.name}</span>
                    <span className="text-gray-500">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-full rounded-full transition-all duration-300" style={{ width: `${skill.level}%`, backgroundColor: theme.primary }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {cvData.languages.some(lang => lang.language) && (
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Languages</h3>
            <div className="space-y-2">
              {cvData.languages.map((lang, index) => lang.language && (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">{lang.language}</span>
                  <Badge variant="secondary" style={{ backgroundColor: `${theme.accent}20`, color: theme.accent }}>
                    {lang.proficiency}
                  </Badge>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  </div>
);

export default function CVBuilderPage() {
  const [activeTab, setActiveTab] = useState('editor');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isParsingCV, setIsParsingCV] = useState(false);
  const [theme] = useState({
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    accent: '#10B981'
  });

  const [cvData, setCvData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
      title: '',
      linkedin: '',
      github: '',
      photo: null
    },
    experience: [],
    education: [],
    skills: [],
    languages: [],
    projects: []
  });

  const fileInputRef = useRef();
  const cvUploadRef = useRef();
  const { toast } = useToast();

  // Enhanced CV upload handler
  const handleCVUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    console.log('Starting file processing:', file.name);

    setIsParsingCV(true);
    try {
      const parsedData = await parseUploadedCV(file);
      console.log('Parsing completed:', parsedData);
      
      // Clear the file input
      event.target.value = '';
      
      // Update state with parsed data
      setCvData(prev => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, ...parsedData.personalInfo },
        experience: [...prev.experience, ...(parsedData.experience || [])],
        education: [...prev.education, ...(parsedData.education || [])],
        skills: parsedData.skills.length > 0 ? parsedData.skills : prev.skills,
        languages: [...prev.languages, ...(parsedData.languages || [])],
        projects: [...prev.projects, ...(parsedData.projects || [])]
      }));

      toast('✅ CV Imported Successfully!', 'Your CV has been parsed and imported. Please review and edit the information.');
    } catch (error) {
      console.error('CV parsing error:', error);
      toast('❌ Import Failed', error.message || 'Please try a different file format or check the file content.', 'destructive');
    } finally {
      setIsParsingCV(false);
    }
  };

  // Handle photo upload
  const handlePhotoUpload = async (event) => {
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
        toast('Photo Uploaded', 'Profile photo added successfully.');
      };
      reader.readAsDataURL(file);
    }
  };

  // Download PDF
  const downloadPDF = async () => {
    if (!cvData.personalInfo.firstName || !cvData.personalInfo.lastName) {
      toast('Missing Information', 'Please fill in your first and last name.', 'destructive');
      return;
    }

    setIsGeneratingPDF(true);
    try {
      const pdf = await generatePDF(cvData, theme);
      pdf.save(`${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}_CV.pdf`);
      
      toast('✅ CV Downloaded!', 'Your professional CV has been saved as PDF.');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast('❌ Download Failed', 'Please try again. If the problem persists, check the console.', 'destructive');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Add new sections with unique IDs
  const addExperience = () => {
    setCvData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: generateUniqueId(),
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
          id: generateUniqueId(),
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

  // Remove functions
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Professional CV Builder
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your resume (PDF, Word, Text), edit it, and download a stunning PDF CV
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-white/80 border border-gray-200 p-1 rounded-2xl">
            <TabsTrigger value="editor" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg">
              <Edit3 className="h-4 w-4" />
              <span className="font-semibold">Editor</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg">
              <Eye className="h-4 w-4" />
              <span className="font-semibold">Preview</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="xl:col-span-1 space-y-6">
                {/* CV Upload Card */}
                <Card className="border-blue-200 bg-blue-50/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Scan className="h-5 w-5 text-blue-600" />
                      Import CV
                    </CardTitle>
                    <CardDescription>
                      Upload PDF, Word, or Text files
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <input
                      type="file"
                      ref={cvUploadRef}
                      onChange={handleCVUpload}
                      accept=".pdf,.doc,.docx,.txt"
                      className="hidden"
                    />
                    <Button 
                      onClick={() => cvUploadRef.current?.click()}
                      disabled={isParsingCV}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isParsingCV ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Parsing CV...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          Upload CV File
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-gray-500 text-center">
                      Supports: PDF, DOC, DOCX, TXT
                    </p>
                  </CardContent>
                </Card>

                {/* Export Card */}
                <Card className="border-green-200 bg-green-50/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Download className="h-5 w-5 text-green-600" />
                      Export CV
                    </CardTitle>
                    <CardDescription>
                      Download your CV as a beautiful PDF
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={downloadPDF}
                      disabled={isGeneratingPDF}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      {isGeneratingPDF ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Generating PDF...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Main Editor */}
              <div className="xl:col-span-3 space-y-6">
                {/* Personal Information Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
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
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoUpload}
                        accept="image/*"
                        className="hidden"
                      />
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

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          value={cvData.personalInfo.location}
                          onChange={(e) => updatePersonalInfo('location', e.target.value)}
                          placeholder="New York, NY"
                        />
                      </div>
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
                  </CardContent>
                </Card>

                {/* Experience Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xl">
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
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xl">
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
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xl">
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
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xl">
                        <MapPin className="h-6 w-6 text-blue-600" />
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
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-8">
            <div className="flex justify-center">
              <CVPreview cvData={cvData} theme={theme} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}