// frontend/app/quotations/page.js
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { 
  Download, 
  FileText, 
  FileDown, 
  Plus, 
  Trash2, 
  Calculator,
  Building,
  User,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  Star,
  Shield,
  Zap,
  Lightbulb,
  Copy,
  Printer,
  Save,
  Upload,
  Edit3,
  Users,
  Sparkles,
  History,
  Send,
  FileUp,
  Image,
  Palette,
  Layout,
  Eye,
  Share2,
  Mail as MailIcon,
  Award,
  Globe,
  MapPin,
  CreditCard,
  CalendarDays,
  FileCheck,
  TrendingUp,
  Clock,
  Target,
  BarChart3
} from 'lucide-react';

// PDF generation - using basic jsPDF without autotable
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableCell, TableRow, WidthType, BorderStyle } from 'docx';

// Premium templates with enhanced styling
const QUOTATION_TEMPLATES = [
  {
    id: 'premium-web',
    name: 'Premium Web Development',
    category: 'Technology',
    color: 'bg-gradient-to-r from-blue-600 to-purple-600',
    icon: '💻',
    items: [
      { description: 'Premium Website Design & UI/UX', quantity: 1, rate: 3500, amount: 3500 },
      { description: 'Advanced Frontend Development', quantity: 1, rate: 4500, amount: 4500 },
      { description: 'Enterprise Backend Development', quantity: 1, rate: 5500, amount: 5500 },
      { description: 'SEO & Performance Optimization', quantity: 1, rate: 1800, amount: 1800 },
      { description: 'Premium Maintenance (6 months)', quantity: 6, rate: 500, amount: 3000 }
    ],
    notes: 'Includes premium responsive design, advanced SEO optimization, and 6 months of priority technical support. Project completion within 8 weeks with weekly progress updates.',
    terms: '50% advance payment required. Balance due upon project completion. 30-day premium support included. Rush delivery available at 25% premium.'
  },
  {
    id: 'executive-consulting',
    name: 'Executive Consulting',
    category: 'Professional Services',
    color: 'bg-gradient-to-r from-emerald-600 to-teal-600',
    icon: '📊',
    items: [
      { description: 'Executive Strategic Analysis', quantity: 1, rate: 7500, amount: 7500 },
      { description: 'Market Research & Competitive Analysis', quantity: 1, rate: 4500, amount: 4500 },
      { description: 'Implementation Roadmap', quantity: 1, rate: 5500, amount: 5500 },
      { description: 'Performance Dashboard Setup', quantity: 1, rate: 2500, amount: 2500 }
    ],
    notes: 'Comprehensive executive business analysis with actionable insights and detailed implementation roadmap. Includes quarterly review sessions.',
    terms: 'Payment in three installments. Executive weekly progress reports. 30-day revision period. Confidentiality guaranteed.'
  },
  {
    id: 'platinum-maintenance',
    name: 'Platinum Maintenance',
    category: 'Support',
    color: 'bg-gradient-to-r from-amber-600 to-orange-600',
    icon: '🛡️',
    items: [
      { description: 'Platinum Routine Maintenance', quantity: 12, rate: 600, amount: 7200 },
      { description: '24/7 Priority Support', quantity: 1, rate: 2000, amount: 2000 },
      { description: 'Advanced Software Updates', quantity: 4, rate: 500, amount: 2000 },
      { description: 'Enterprise Security Monitoring', quantity: 12, rate: 400, amount: 4800 }
    ],
    notes: '24/7 priority emergency support with 1-hour response time. Regular maintenance visits and advanced security monitoring with threat detection.',
    terms: 'Annual platinum contract. 1-hour response time for emergencies. Monthly executive performance reports. Service level agreement included.'
  }
];

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' }
];

const PREMIUM_THEMES = [
  { 
    id: 'executive', 
    name: 'Executive', 
    primary: '#1e40af', 
    secondary: '#1e3a8a',
    accent: '#f59e0b',
    gradient: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)'
  },
  { 
    id: 'modern', 
    name: 'Modern', 
    primary: '#7c3aed', 
    secondary: '#6d28d9',
    accent: '#06b6d4',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)'
  },
  { 
    id: 'corporate', 
    name: 'Corporate', 
    primary: '#059669', 
    secondary: '#047857',
    accent: '#dc2626',
    gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
  },
  { 
    id: 'luxury', 
    name: 'Luxury', 
    primary: '#dc2626', 
    secondary: '#b91c1c',
    accent: '#d97706',
    gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
  }
];

const QuotationGenerator = () => {
  const [isClient, setIsClient] = useState(false);
  const [quotation, setQuotation] = useState({
    quotationNumber: 'QT-000000',
    date: '',
    validUntil: '',
    status: 'draft',
    currency: 'USD',
    taxRate: 10,
    discount: 0,
    notes: 'Thank you for considering our premium services. We are committed to delivering exceptional quality and value for your investment.',
    terms: 'Payment terms: 50% advance required for project commencement, balance due upon completion. All payments are due within 30 days of invoice date. Rush delivery available at 25% premium.',
    title: 'Premium Services Quotation',
    theme: 'executive',
    paymentTerms: 'Net 30',
    deliveryTime: '4-6 weeks'
  });

  const [client, setClient] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    website: ''
  });

  const [items, setItems] = useState([]);
  const [company, setCompany] = useState({
    name: 'Elite Solutions Inc.',
    email: 'contact@elitesolutions.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Avenue, Suite 1000',
    city: 'New York, NY 10001',
    country: 'United States',
    website: 'www.elitesolutions.com',
    taxId: 'TAX-123456789',
    logo: '',
    tagline: 'Premium Business Solutions',
    founded: '2015',
    accreditation: 'A+ BBB Rated'
  });

  const [activeTab, setActiveTab] = useState('editor');
  const [clientsList, setClientsList] = useState([]);
  const [recentQuotations, setRecentQuotations] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Initialize component
  useEffect(() => {
    setIsClient(true);
    
    const today = new Date().toISOString().split('T')[0];
    const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    setQuotation(prev => ({
      ...prev,
      quotationNumber: generateQuotationNumber(),
      date: today,
      validUntil: validUntil
    }));

    setItems([
      { id: 1, description: 'Executive Consultation & Strategy Session', quantity: 2, rate: 250, amount: 500, category: 'service' },
      { id: 2, description: 'Premium Development Hours', quantity: 40, rate: 125, amount: 5000, category: 'development' },
      { id: 3, description: 'Advanced Project Management', quantity: 10, rate: 95, amount: 950, category: 'management' },
      { id: 4, description: 'Quality Assurance & Testing', quantity: 8, rate: 85, amount: 680, category: 'testing' }
    ]);

    const sampleClients = [
      {
        id: 1,
        name: 'John Smith',
        company: 'Tech Innovations LLC',
        email: 'john@techinnovations.com',
        phone: '+1 (555) 123-4567',
        address: '456 Tech Park Drive\nSan Francisco, CA 94102',
        city: 'San Francisco',
        country: 'United States'
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        company: 'Global Enterprises Corp',
        email: 'sarah@globalenterprises.com',
        phone: '+1 (555) 987-6543',
        address: '789 Corporate Boulevard\nChicago, IL 60601',
        city: 'Chicago',
        country: 'United States'
      }
    ];
    setClientsList(sampleClients);

    const sampleRecent = [
      { id: 1, number: 'QT-001234', client: 'Tech Innovations LLC', amount: 4350, date: '2024-01-15', status: 'accepted' },
      { id: 2, number: 'QT-001235', client: 'Global Enterprises Corp', amount: 8900, date: '2024-01-18', status: 'pending' }
    ];
    setRecentQuotations(sampleRecent);
  }, []);

  const generateQuotationNumber = () => {
    if (typeof window === 'undefined') return 'QT-000000';
    return `QT-${Date.now().toString().slice(-6)}`;
  };

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
      category: 'service'
    };
    setItems([...items, newItem]);
    toast.success("New item added", {
      description: "Fill in the details for the new quotation item."
    });
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
    toast.success("Item removed", {
      description: "The item has been removed from your quotation."
    });
  };

  const updateItem = (id, field, value) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        return updatedItem;
      }
      return item;
    });
    setItems(updatedItems);
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = (subtotal * quotation.taxRate) / 100;
    const discountAmount = (subtotal * quotation.discount) / 100;
    const total = subtotal + taxAmount - discountAmount;

    return {
      subtotal: subtotal.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const totals = calculateTotals();

  const applyTemplate = (template) => {
    setItems(template.items.map((item, index) => ({
      id: Date.now() + index,
      ...item
    })));
    setQuotation(prev => ({
      ...prev,
      notes: template.notes,
      terms: template.terms
    }));
    toast.success(`"${template.name}" template applied! 🎯`);
  };

  const loadClient = (clientData) => {
    setClient(clientData);
    toast.success("Client loaded successfully! 👤");
  };

  // Fixed PDF Generation without autoTable
  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      const doc = new jsPDF();
      const currencySymbol = CURRENCIES.find(c => c.code === quotation.currency)?.symbol || '$';
      const theme = PREMIUM_THEMES.find(t => t.id === quotation.theme) || PREMIUM_THEMES[0];

      // Set document properties
      doc.setProperties({
        title: `Quotation ${quotation.quotationNumber}`,
        subject: 'Professional Quotation',
        author: company.name,
        keywords: 'quotation, invoice, business',
        creator: 'Premium Quotation Generator'
      });

      // Premium Header with Gradient
      doc.setFillColor(30, 64, 175);
      doc.rect(0, 0, 210, 50, 'F');
      
      // Company Info
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(company.name, 20, 20);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(company.tagline || 'Premium Business Solutions', 20, 28);
      doc.text(company.email, 20, 35);
      doc.text(company.phone, 20, 42);

      // Quotation Title and Number
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('QUOTATION', 180, 20, { align: 'right' });
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Number: ${quotation.quotationNumber}`, 180, 28, { align: 'right' });
      doc.text(`Date: ${quotation.date}`, 180, 35, { align: 'right' });
      doc.text(`Valid Until: ${quotation.validUntil}`, 180, 42, { align: 'right' });

      // Client Information Section
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('BILL TO:', 20, 70);
      doc.setFont('helvetica', 'normal');
      
      let clientY = 78;
      if (client.name) doc.text(client.name, 20, clientY);
      if (client.company) doc.text(client.company, 20, clientY + 7);
      if (client.email) doc.text(client.email, 20, clientY + 14);
      if (client.phone) doc.text(client.phone, 20, clientY + 21);
      if (client.address) doc.text(client.address, 20, clientY + 28);

      // Items Table Header
      doc.setFillColor(30, 64, 175);
      doc.rect(20, 110, 170, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Description', 22, 117);
      doc.text('Qty', 140, 117);
      doc.text('Rate', 155, 117);
      doc.text('Amount', 180, 117, { align: 'right' });

      // Items Rows
      let yPosition = 125;
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      
      items.forEach((item, index) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        // Alternate row colors
        if (index % 2 === 0) {
          doc.setFillColor(245, 245, 245);
          doc.rect(20, yPosition - 4, 170, 8, 'F');
        }
        
        doc.text(item.description.substring(0, 40), 22, yPosition);
        doc.text(item.quantity.toString(), 140, yPosition);
        doc.text(`${currencySymbol}${item.rate.toFixed(2)}`, 155, yPosition);
        doc.text(`${currencySymbol}${item.amount.toFixed(2)}`, 180, yPosition, { align: 'right' });
        yPosition += 8;
      });

      const finalY = Math.max(yPosition + 10, 130);

      // Summary Section
      doc.setFillColor(249, 250, 251);
      doc.rect(120, finalY, 80, 60, 'F');
      doc.setDrawColor(209, 213, 219);
      doc.rect(120, finalY, 80, 60);

      doc.setFontSize(10);
      doc.setTextColor(75, 85, 99);
      
      let summaryY = finalY + 10;
      doc.text('Subtotal:', 130, summaryY);
      doc.text(`${currencySymbol}${totals.subtotal}`, 180, summaryY, { align: 'right' });
      
      doc.text(`Tax (${quotation.taxRate}%):`, 130, summaryY + 8);
      doc.text(`${currencySymbol}${totals.taxAmount}`, 180, summaryY + 8, { align: 'right' });
      
      doc.text(`Discount (${quotation.discount}%):`, 130, summaryY + 16);
      doc.text(`-${currencySymbol}${totals.discountAmount}`, 180, summaryY + 16, { align: 'right' });
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('TOTAL:', 130, summaryY + 28);
      doc.text(`${currencySymbol}${totals.total}`, 180, summaryY + 28, { align: 'right' });

      // Notes and Terms
      const notesStartY = finalY + 70;
      
      if (quotation.notes) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Notes:', 20, notesStartY);
        doc.setFont('helvetica', 'normal');
        const splitNotes = doc.splitTextToSize(quotation.notes, 170);
        doc.text(splitNotes, 20, notesStartY + 7);
      }

      if (quotation.terms) {
        const termsY = notesStartY + (quotation.notes ? 30 : 0);
        doc.setFont('helvetica', 'bold');
        doc.text('Terms & Conditions:', 20, termsY);
        doc.setFont('helvetica', 'normal');
        const splitTerms = doc.splitTextToSize(quotation.terms, 170);
        doc.text(splitTerms, 20, termsY + 7);
      }

      // Footer
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated by ${company.name} - ${company.website}`, 105, pageHeight - 10, { align: 'center' });
      doc.text(`Page 1 of 1`, 105, pageHeight - 5, { align: 'center' });

      // Save the PDF
      doc.save(`quotation-${quotation.quotationNumber}.pdf`);
      toast.success("Premium PDF generated successfully! 📄", {
        description: "Your professional quotation is ready for download."
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error("Failed to generate PDF", {
        description: "Please try again or contact support."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Enhanced Word Document Generation
  const generateWord = async () => {
    setIsGenerating(true);
    
    try {
      const currencySymbol = CURRENCIES.find(c => c.code === quotation.currency)?.symbol || '$';

      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Header
            new Paragraph({
              children: [
                new TextRun({
                  text: company.name,
                  bold: true,
                  size: 32,
                  color: "1e40af"
                })
              ],
              alignment: AlignmentType.LEFT,
              spacing: { after: 200 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: company.tagline || "Premium Business Solutions",
                  italics: true,
                  color: "6b7280"
                })
              ],
              alignment: AlignmentType.LEFT,
              spacing: { after: 400 }
            }),

            // Quotation Title
            new Paragraph({
              children: [
                new TextRun({
                  text: "QUOTATION",
                  bold: true,
                  size: 28,
                  color: "1e40af"
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 }
            }),

            // Quotation Details
            new Paragraph({
              children: [
                new TextRun({ text: `Quotation Number: ${quotation.quotationNumber}`, bold: true }),
                new TextRun({ text: `\tDate: ${quotation.date}`, bold: true }),
                new TextRun({ text: `\tValid Until: ${quotation.validUntil}`, bold: true })
              ],
              alignment: AlignmentType.LEFT,
              spacing: { after: 400 }
            }),

            // Client Information
            new Paragraph({
              children: [
                new TextRun({
                  text: "BILL TO:",
                  bold: true,
                  size: 20
                })
              ],
              spacing: { after: 200 }
            }),

            new Paragraph({
              children: [
                new TextRun({ text: client.name || "Client Name", bold: true }),
                new TextRun({ text: client.company ? `\n${client.company}` : "", break: 1 }),
                new TextRun({ text: client.email ? `\n${client.email}` : "", break: 1 }),
                new TextRun({ text: client.phone ? `\n${client.phone}` : "", break: 1 }),
                new TextRun({ text: client.address ? `\n${client.address}` : "", break: 1 })
              ],
              spacing: { after: 400 }
            }),

            // Items Table Header
            new Paragraph({
              children: [
                new TextRun({
                  text: "QUOTATION ITEMS",
                  bold: true,
                  size: 20
                })
              ],
              spacing: { after: 200 }
            }),

            // Items Table
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1, color: "1e40af" },
                bottom: { style: BorderStyle.SINGLE, size: 1, color: "1e40af" },
                left: { style: BorderStyle.SINGLE, size: 1, color: "1e40af" },
                right: { style: BorderStyle.SINGLE, size: 1, color: "1e40af" },
                insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "d1d5db" },
                insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "d1d5db" }
              },
              rows: [
                // Header Row
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "Description", bold: true })] })],
                      shading: { fill: "1e40af" }
                    }),
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "Quantity", bold: true })] })],
                      shading: { fill: "1e40af" }
                    }),
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "Unit Price", bold: true })] })],
                      shading: { fill: "1e40af" }
                    }),
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "Amount", bold: true })] })],
                      shading: { fill: "1e40af" }
                    })
                  ]
                }),
                // Item Rows
                ...items.map(item =>
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ text: item.description })]
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: item.quantity.toString() })]
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: `${currencySymbol}${item.rate.toFixed(2)}` })]
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: `${currencySymbol}${item.amount.toFixed(2)}` })]
                      })
                    ]
                  })
                )
              ]
            }),

            // Summary Section
            new Paragraph({
              children: [
                new TextRun({
                  text: "SUMMARY",
                  bold: true,
                  size: 20
                })
              ],
              spacing: { before: 400, after: 200 }
            }),

            new Paragraph({
              children: [
                new TextRun({ text: `Subtotal: ${currencySymbol}${totals.subtotal}` }),
                new TextRun({ text: `\nTax (${quotation.taxRate}%): ${currencySymbol}${totals.taxAmount}`, break: 1 }),
                new TextRun({ text: `\nDiscount (${quotation.discount}%): -${currencySymbol}${totals.discountAmount}`, break: 1 }),
                new TextRun({ text: `\nTOTAL: ${currencySymbol}${totals.total}`, break: 1, bold: true, size: 24 })
              ],
              spacing: { after: 400 }
            }),

            // Notes and Terms
            new Paragraph({
              children: [
                new TextRun({
                  text: "Notes:",
                  bold: true,
                  size: 16
                })
              ],
              spacing: { after: 200 }
            }),

            new Paragraph({
              children: [
                new TextRun(quotation.notes)
              ],
              spacing: { after: 400 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Terms & Conditions:",
                  bold: true,
                  size: 16
                })
              ],
              spacing: { after: 200 }
            }),

            new Paragraph({
              children: [
                new TextRun(quotation.terms)
              ]
            }),

            // Footer
            new Paragraph({
              children: [
                new TextRun({
                  text: `Generated by ${company.name}`,
                  size: 12,
                  color: "6b7280"
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { before: 800 }
            })
          ]
        }]
      });

      const buffer = await Packer.toBlob(doc);
      saveAs(buffer, `quotation-${quotation.quotationNumber}.docx`);
      toast.success("Premium Word document generated! 📝", {
        description: "Your professional quotation is ready for download."
      });
    } catch (error) {
      console.error('Word generation error:', error);
      toast.error("Failed to generate Word document");
    } finally {
      setIsGenerating(false);
    }
  };

  const sendQuotation = () => {
    if (!client.email) {
      toast.error("Please enter client email first");
      return;
    }
    
    toast.success(`Premium quotation sent to ${client.email}! ✉️`, {
      description: "Your professional quotation has been emailed successfully."
    });
  };

  const copyToClipboard = async () => {
    const text = `Quotation ${quotation.quotationNumber}\nTotal: ${quotation.currency} ${totals.total}`;
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard! 📋");
  };

  const printQuotation = () => {
    toast.success("Opening print dialog... 🖨️");
    setTimeout(() => window.print(), 500);
  };

  const quickActions = [
    { icon: FileUp, label: "Save Template", action: () => toast.success("Saved! 💾"), color: "text-blue-600" },
    { icon: Send, label: "Send to Client", action: sendQuotation, color: "text-green-600" },
    { icon: Download, label: "Export PDF", action: generatePDF, color: "text-purple-600" },
    { icon: Copy, label: "Duplicate", action: copyToClipboard, color: "text-orange-600" }
  ];

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCompany({...company, logo: e.target.result});
        toast.success("Logo uploaded successfully! 🖼️");
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-emerald-50/20 p-6">
        <div className="max-w-8xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading Premium Quotation Generator...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-emerald-50/20 p-6">
      <div className="max-w-8xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-blue-800 bg-clip-text text-transparent">
                Premium Quotation Generator
              </h1>
              <p className="text-xl text-slate-600 mt-2">
                Create stunning professional quotations that impress clients
              </p>
            </div>
          </div>
          
          {/* Enhanced Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-6">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-sm">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-slate-900">{items.length}</div>
                <div className="text-xs text-slate-600">Line Items</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-sm">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-green-600">{quotation.currency} {totals.total}</div>
                <div className="text-xs text-slate-600">Total Value</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-sm">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">{quotation.taxRate}%</div>
                <div className="text-xs text-slate-600">Tax Rate</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-sm">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-orange-600">{quotation.discount}%</div>
                <div className="text-xs text-slate-600">Discount</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Preview Mode Toggle */}
        <div className="flex justify-end mb-4">
          <Button 
            variant={previewMode ? "default" : "outline"} 
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm"
          >
            <Eye className="w-4 h-4" />
            {previewMode ? 'Edit Mode' : 'Preview Mode'}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-12 bg-slate-100/80 backdrop-blur-sm p-1 rounded-2xl border border-slate-200/50">
            <TabsTrigger value="editor" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Edit3 className="w-4 h-4 mr-2" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="templates" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="clients" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Users className="w-4 h-4 mr-2" />
              Clients
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <History className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          {/* Editor Tab */}
          <TabsContent value="editor" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Sidebar - Forms */}
              {!previewMode && (
                <div className="xl:col-span-1 space-y-6">
                  {/* Quick Actions */}
                  <Card className="border-slate-200/60 shadow-sm bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Zap className="w-5 h-5 text-yellow-600" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        {quickActions.map((action, index) => (
                          <TooltipProvider key={index}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="h-14 flex-col gap-1 border-slate-200/60 hover:border-slate-300"
                                  onClick={action.action}
                                >
                                  <action.icon className={`w-5 h-5 ${action.color}`} />
                                  <span className="text-xs font-medium">{action.label}</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{action.label}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Theme Selection */}
                  <Card className="border-slate-200/60 shadow-sm bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Palette className="w-5 h-5 text-purple-600" />
                        Design Theme
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
                        {PREMIUM_THEMES.map(theme => (
                          <button
                            key={theme.id}
                            onClick={() => setQuotation({...quotation, theme: theme.id})}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              quotation.theme === theme.id 
                                ? 'border-blue-500 ring-2 ring-blue-200' 
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: theme.primary }}
                              />
                              <span className="text-sm font-medium">{theme.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Company Details */}
                  <Card className="border-slate-200/60 shadow-sm bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Building className="w-5 h-5 text-blue-600" />
                        Company Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <Label htmlFor="companyName" className="text-sm font-medium">Company Name</Label>
                        <Input
                          id="companyName"
                          value={company.name}
                          onChange={(e) => setCompany({...company, name: e.target.value})}
                          className="focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="companyLogo" className="text-sm font-medium">Company Logo</Label>
                        <div className="flex items-center gap-3">
                          {company.logo && (
                            <img src={company.logo} alt="Company Logo" className="w-12 h-12 object-contain rounded" />
                          )}
                          <Input
                            id="companyLogo"
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-3">
                          <Label htmlFor="companyEmail" className="text-sm font-medium">Email</Label>
                          <Input
                            id="companyEmail"
                            value={company.email}
                            onChange={(e) => setCompany({...company, email: e.target.value})}
                            className="focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="companyPhone" className="text-sm font-medium">Phone</Label>
                          <Input
                            id="companyPhone"
                            value={company.phone}
                            onChange={(e) => setCompany({...company, phone: e.target.value})}
                            className="focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="companyTagline" className="text-sm font-medium">Tagline</Label>
                        <Input
                          id="companyTagline"
                          value={company.tagline}
                          onChange={(e) => setCompany({...company, tagline: e.target.value})}
                          className="focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Client Information */}
                  <Card className="border-slate-200/60 shadow-sm bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <User className="w-5 h-5 text-green-600" />
                        Client Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-3">
                          <Label htmlFor="clientName" className="text-sm font-medium">Client Name *</Label>
                          <Input
                            id="clientName"
                            value={client.name}
                            onChange={(e) => setClient({...client, name: e.target.value})}
                            className="focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="clientCompany" className="text-sm font-medium">Company</Label>
                          <Input
                            id="clientCompany"
                            value={client.company}
                            onChange={(e) => setClient({...client, company: e.target.value})}
                            className="focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="clientEmail" className="text-sm font-medium">Email</Label>
                        <Input
                          id="clientEmail"
                          type="email"
                          value={client.email}
                          onChange={(e) => setClient({...client, email: e.target.value})}
                          className="focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-3">
                          <Label htmlFor="clientPhone" className="text-sm font-medium">Phone</Label>
                          <Input
                            id="clientPhone"
                            value={client.phone}
                            onChange={(e) => setClient({...client, phone: e.target.value})}
                            className="focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="clientCountry" className="text-sm font-medium">Country</Label>
                          <Input
                            id="clientCountry"
                            value={client.country}
                            onChange={(e) => setClient({...client, country: e.target.value})}
                            className="focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quotation Details */}
                  <Card className="border-slate-200/60 shadow-sm bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <FileText className="w-5 h-5 text-purple-600" />
                        Quotation Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-3">
                          <Label htmlFor="quotationNumber" className="text-sm font-medium">Quotation #</Label>
                          <Input
                            id="quotationNumber"
                            value={quotation.quotationNumber}
                            onChange={(e) => setQuotation({...quotation, quotationNumber: e.target.value})}
                            className="focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="currency" className="text-sm font-medium">Currency</Label>
                          <Select value={quotation.currency} onValueChange={(value) => setQuotation({...quotation, currency: value})}>
                            <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {CURRENCIES.map(currency => (
                                <SelectItem key={currency.code} value={currency.code}>
                                  {currency.code} ({currency.symbol})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-3">
                          <Label htmlFor="taxRate" className="text-sm font-medium">Tax Rate (%)</Label>
                          <Input
                            id="taxRate"
                            type="number"
                            value={quotation.taxRate}
                            onChange={(e) => setQuotation({...quotation, taxRate: parseFloat(e.target.value) || 0})}
                            className="focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="discount" className="text-sm font-medium">Discount (%)</Label>
                          <Input
                            id="discount"
                            type="number"
                            value={quotation.discount}
                            onChange={(e) => setQuotation({...quotation, discount: parseFloat(e.target.value) || 0})}
                            className="focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-3">
                          <Label htmlFor="paymentTerms" className="text-sm font-medium">Payment Terms</Label>
                          <Select value={quotation.paymentTerms} onValueChange={(value) => setQuotation({...quotation, paymentTerms: value})}>
                            <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Net 15">Net 15</SelectItem>
                              <SelectItem value="Net 30">Net 30</SelectItem>
                              <SelectItem value="Net 60">Net 60</SelectItem>
                              <SelectItem value="Due on receipt">Due on receipt</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="deliveryTime" className="text-sm font-medium">Delivery Time</Label>
                          <Select value={quotation.deliveryTime} onValueChange={(value) => setQuotation({...quotation, deliveryTime: value})}>
                            <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                              <SelectItem value="2-4 weeks">2-4 weeks</SelectItem>
                              <SelectItem value="4-6 weeks">4-6 weeks</SelectItem>
                              <SelectItem value="8+ weeks">8+ weeks</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Main Content */}
              <div className={`${previewMode ? 'xl:col-span-3' : 'xl:col-span-2'} space-y-6`}>
                {/* Quotation Preview/Editor */}
                <Card className="border-slate-200/60 shadow-sm bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between text-lg">
                      <span className="flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-orange-600" />
                        {previewMode ? 'Quotation Preview' : 'Quotation Items'}
                        <Badge variant="secondary" className="ml-2">
                          {items.length} items
                        </Badge>
                      </span>
                      {!previewMode && (
                        <Button onClick={addItem} size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Item
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {previewMode ? (
                      // Premium Preview Mode
                      <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
                        {/* Company Header */}
                        <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-200">
                          <div>
                            {company.logo && (
                              <img src={company.logo} alt="Company Logo" className="h-16 mb-4" />
                            )}
                            <h1 className="text-2xl font-bold text-slate-900">{company.name}</h1>
                            <p className="text-slate-600">{company.tagline}</p>
                            <p className="text-slate-600 text-sm mt-2">{company.address}, {company.city}</p>
                            <p className="text-slate-600 text-sm">{company.phone} • {company.email}</p>
                          </div>
                          <div className="text-right">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">QUOTATION</h2>
                            <div className="mt-3 space-y-1 text-sm">
                              <p className="text-slate-600 font-semibold">#{quotation.quotationNumber}</p>
                              <p className="text-slate-600">Date: {quotation.date}</p>
                              <p className="text-slate-600">Valid Until: {quotation.validUntil}</p>
                              <Badge className="mt-2 bg-green-100 text-green-800">Valid</Badge>
                            </div>
                          </div>
                        </div>

                        {/* Client Info */}
                        <div className="grid grid-cols-2 gap-8 mb-8">
                          <div>
                            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                              <User className="w-4 h-4" />
                              Bill To:
                            </h3>
                            <div className="bg-slate-50 p-4 rounded-lg">
                              <p className="text-slate-800 font-medium">{client.name}</p>
                              {client.company && <p className="text-slate-700">{client.company}</p>}
                              {client.email && <p className="text-slate-700">{client.email}</p>}
                              {client.phone && <p className="text-slate-700">{client.phone}</p>}
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                              <CreditCard className="w-4 h-4" />
                              Payment Terms:
                            </h3>
                            <div className="bg-slate-50 p-4 rounded-lg">
                              <p className="text-slate-800">{quotation.paymentTerms}</p>
                              <p className="text-slate-700 text-sm mt-1">Delivery: {quotation.deliveryTime}</p>
                            </div>
                          </div>
                        </div>

                        {/* Items Table */}
                        <div className="mb-8">
                          <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white px-4 py-3 rounded-t-lg">
                            <h3 className="font-semibold flex items-center gap-2">
                              <FileCheck className="w-4 h-4" />
                              Quotation Items
                            </h3>
                          </div>
                          <table className="w-full border border-slate-200 rounded-b-lg overflow-hidden">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="text-left p-4 font-semibold text-slate-900">Description</th>
                                <th className="text-right p-4 font-semibold text-slate-900">Qty</th>
                                <th className="text-right p-4 font-semibold text-slate-900">Unit Price</th>
                                <th className="text-right p-4 font-semibold text-slate-900">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {items.map((item, index) => (
                                <tr key={item.id} className={`border-b border-slate-100 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                                  <td className="p-4 text-slate-700">{item.description}</td>
                                  <td className="p-4 text-right text-slate-700">{item.quantity}</td>
                                  <td className="p-4 text-right text-slate-700">
                                    {CURRENCIES.find(c => c.code === quotation.currency)?.symbol}{item.rate.toFixed(2)}
                                  </td>
                                  <td className="p-4 text-right text-slate-700 font-medium">
                                    {CURRENCIES.find(c => c.code === quotation.currency)?.symbol}{item.amount.toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Enhanced Totals */}
                        <div className="flex justify-end mb-8">
                          <div className="w-80 bg-slate-900 text-white rounded-lg p-6">
                            <div className="space-y-3">
                              <div className="flex justify-between text-slate-300">
                                <span>Subtotal:</span>
                                <span>{CURRENCIES.find(c => c.code === quotation.currency)?.symbol} {totals.subtotal}</span>
                              </div>
                              <div className="flex justify-between text-slate-300">
                                <span>Tax ({quotation.taxRate}%):</span>
                                <span>{CURRENCIES.find(c => c.code === quotation.currency)?.symbol} {totals.taxAmount}</span>
                              </div>
                              <div className="flex justify-between text-slate-300">
                                <span>Discount ({quotation.discount}%):</span>
                                <span className="text-red-300">-{CURRENCIES.find(c => c.code === quotation.currency)?.symbol} {totals.discountAmount}</span>
                              </div>
                              <div className="border-t border-slate-700 pt-3 mt-2">
                                <div className="flex justify-between text-lg font-bold">
                                  <span>Total Amount:</span>
                                  <span className="text-green-400 text-xl">
                                    {CURRENCIES.find(c => c.code === quotation.currency)?.symbol} {totals.total}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Notes & Terms */}
                        <div className="grid grid-cols-2 gap-8 text-sm">
                          <div>
                            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                              <Lightbulb className="w-4 h-4" />
                              Notes
                            </h4>
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <p className="text-slate-700 whitespace-pre-line">{quotation.notes}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              Terms & Conditions
                            </h4>
                            <div className="bg-slate-50 p-4 rounded-lg">
                              <p className="text-slate-700 whitespace-pre-line">{quotation.terms}</p>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-slate-200 text-center text-slate-500 text-sm">
                          <p>Generated by {company.name} • {company.website} • {company.email}</p>
                          <p className="mt-1">This quotation is valid until {quotation.validUntil}</p>
                        </div>
                      </div>
                    ) : (
                      // Editor Mode
                      <div className="space-y-4">
                        {items.map((item, index) => (
                          <div key={item.id} className="grid grid-cols-12 gap-3 items-start p-4 bg-slate-50/50 rounded-xl border border-slate-200/50">
                            <div className="col-span-1 flex items-center justify-center">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-semibold text-sm">
                                {index + 1}
                              </div>
                            </div>
                            <div className="col-span-5">
                              <Label className="text-xs text-slate-500 mb-2 block">Description</Label>
                              <Input
                                value={item.description}
                                onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                placeholder="Item description"
                                className="focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="col-span-2">
                              <Label className="text-xs text-slate-500 mb-2 block">Quantity</Label>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                className="focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="col-span-2">
                              <Label className="text-xs text-slate-500 mb-2 block">Rate</Label>
                              <Input
                                type="number"
                                value={item.rate}
                                onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                                className="focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="col-span-1">
                              <Label className="text-xs text-slate-500 mb-2 block">Amount</Label>
                              <div className="h-10 flex items-center justify-center font-semibold text-slate-700 bg-white border border-slate-200 rounded-md px-3">
                                {CURRENCIES.find(c => c.code === quotation.currency)?.symbol} {item.amount.toFixed(2)}
                              </div>
                            </div>
                            <div className="col-span-1 flex items-center justify-center pt-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeItem(item.id)}
                                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Remove item</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        ))}

                        {/* Enhanced Totals */}
                        <div className="mt-6 p-6 bg-gradient-to-r from-slate-900 to-blue-900 rounded-xl text-white shadow-lg">
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <div className="flex justify-between text-slate-300">
                                <span>Subtotal:</span>
                                <span>{CURRENCIES.find(c => c.code === quotation.currency)?.symbol} {totals.subtotal}</span>
                              </div>
                              <div className="flex justify-between text-slate-300">
                                <span>Tax ({quotation.taxRate}%):</span>
                                <span>{CURRENCIES.find(c => c.code === quotation.currency)?.symbol} {totals.taxAmount}</span>
                              </div>
                              <div className="flex justify-between text-slate-300">
                                <span>Discount ({quotation.discount}%):</span>
                                <span className="text-red-300">-{CURRENCIES.find(c => c.code === quotation.currency)?.symbol} {totals.discountAmount}</span>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between text-lg font-bold border-t border-slate-700 pt-3">
                                <span>Total Amount:</span>
                                <span className="text-green-400 text-xl">
                                  {CURRENCIES.find(c => c.code === quotation.currency)?.symbol} {totals.total}
                                </span>
                              </div>
                              <div className="text-xs text-slate-400">
                                Valid until: {quotation.validUntil ? new Date(quotation.validUntil).toLocaleDateString() : 'Not set'}
                              </div>
                              <div className="text-xs text-slate-400">
                                Quote #: {quotation.quotationNumber}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Notes & Terms */}
                {!previewMode && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-slate-200/60 shadow-sm bg-white/80 backdrop-blur-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Lightbulb className="w-5 h-5 text-yellow-600" />
                          Notes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          value={quotation.notes}
                          onChange={(e) => setQuotation({...quotation, notes: e.target.value})}
                          placeholder="Additional notes for the client..."
                          rows={4}
                          className="focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </CardContent>
                    </Card>

                    <Card className="border-slate-200/60 shadow-sm bg-white/80 backdrop-blur-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Shield className="w-5 h-5 text-blue-600" />
                          Terms & Conditions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          value={quotation.terms}
                          onChange={(e) => setQuotation({...quotation, terms: e.target.value})}
                          placeholder="Payment terms and conditions..."
                          rows={4}
                          className="focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Action Buttons */}
                <Card className="border-slate-200/60 shadow-sm bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button 
                        onClick={generatePDF} 
                        disabled={isGenerating}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex-1 shadow-lg text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {isGenerating ? 'Generating PDF...' : 'Download PDF'}
                      </Button>
                      <Button 
                        onClick={generateWord} 
                        disabled={isGenerating}
                        variant="outline" 
                        className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        <FileDown className="w-4 h-4 mr-2" />
                        {isGenerating ? 'Generating Word...' : 'Export to Word'}
                      </Button>
                      <Button 
                        onClick={printQuotation}
                        variant="outline" 
                        className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50"
                      >
                        <Printer className="w-4 h-4 mr-2" />
                        Print
                      </Button>
                      <Button 
                        onClick={sendQuotation} 
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 flex-1 shadow-lg text-white"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send to Client
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <Card className="border-slate-200/60 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  Professional Templates
                </CardTitle>
                <CardDescription>
                  Choose from premium quotation templates designed for maximum impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {QUOTATION_TEMPLATES.map((template) => (
                    <Card key={template.id} className="border-slate-200/60 hover:border-blue-300 transition-all duration-300 hover:shadow-lg cursor-pointer group overflow-hidden">
                      <div className={`h-2 ${template.color}`}></div>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                            {template.category}
                          </Badge>
                          <div className="text-2xl">{template.icon}</div>
                        </div>
                        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors mt-2">
                          {template.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="text-sm text-slate-600">
                            {template.items.length} pre-configured premium items
                          </div>
                          <div className="space-y-2">
                            {template.items.slice(0, 2).map((item, index) => (
                              <div key={index} className="flex justify-between text-xs text-slate-500">
                                <span className="truncate">{item.description}</span>
                                <span>${item.amount}</span>
                              </div>
                            ))}
                            {template.items.length > 2 && (
                              <div className="text-xs text-slate-400">
                                +{template.items.length - 2} more items
                              </div>
                            )}
                          </div>
                          <Button 
                            onClick={() => applyTemplate(template)}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            Use Premium Template
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            <Card className="border-slate-200/60 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-green-600" />
                  Client Management
                </CardTitle>
                <CardDescription>
                  Manage your client database and quickly load client information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clientsList.map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-4 border border-slate-200/60 rounded-lg hover:bg-slate-50/50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {client.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{client.name}</div>
                          <div className="text-sm text-slate-600">{client.company}</div>
                          <div className="text-xs text-slate-500">{client.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          onClick={() => loadClient(client)} 
                          variant="outline" 
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Load Client
                        </Button>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          Active
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="border-slate-200/60 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-6 h-6 text-orange-600" />
                  Quotation History
                </CardTitle>
                <CardDescription>
                  Track your previous quotations and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentQuotations.map((quote) => (
                    <div key={quote.id} className="flex items-center justify-between p-4 border border-slate-200/60 rounded-lg hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${
                          quote.status === 'accepted' ? 'bg-green-500' : 
                          quote.status === 'pending' ? 'bg-yellow-500' : 'bg-slate-500'
                        }`} />
                        <div>
                          <div className="font-semibold text-slate-900">{quote.number}</div>
                          <div className="text-sm text-slate-600">{quote.client}</div>
                          <div className="text-xs text-slate-500">{quote.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-slate-900">${quote.amount}</div>
                        <Badge 
                          variant={quote.status === 'accepted' ? 'default' : 'secondary'} 
                          className={`mt-1 ${
                            quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {quote.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default QuotationGenerator;