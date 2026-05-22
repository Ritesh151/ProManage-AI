// src/hooks/useProjectForm.js
import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';

const initialFormData = {
  // Client Information
  clientName: '',
  clientMobileNumber: '',
  clientEmail: '',
  inquiryDate: new Date().toISOString().split('T')[0],
  companyName: '',
  companyLocation: '',
  businessType: '',
  yourServices: '',
  yearsInBusiness: '',
  hasSalesTeam: null,
  hasSocialMedia: false,
  socialMediaProfiles: {
    instagram: '',
    facebook: '',
    linkedin: '',
    other: '',
  },
  annualTurnover: '',
  currentGoogleRanking: '',
  hasGoogleBusinessProfile: true,
  hasClientDomain: true,
  hasClientLogo: true,
  hasClientContent: true,
  features: [],
  customFeatures: [],

  // Project Details
  branch: '',
  projectId: '',
  projectName: '',
  category: '',
  scopeOfWork: [],
  projectEndDate: '',
  projectDetails: '',
  numberOfPages: '',
  technologies: {
    frontend: [],
    backend: [],
    database: [],
    other: [],
  },
  cost: 0,
  timeline: {
    value: '',
    unit: 'Months',
  },
};

export const useProjectForm = (project = null) => {
  const [formData, setFormData] = useState(initialFormData);
  const [scopeItems, setScopeItems] = useState([]);
  const [calculatedCost, setCalculatedCost] = useState(0);
  const [calculatedEndDate, setCalculatedEndDate] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors: formErrors },
    reset,
    setValue,
    getValues,
  } = useForm({
    defaultValues: formData,
  });

  useEffect(() => {
    if (project) {
      const parsedTimeline = project.timeline ? parseTimeline(project.timeline) : { value: '', unit: 'Months' };
      const projectCost = project.cost || 0;

      setFormData({
        clientName: project.clientName || '',
        clientMobileNumber: project.clientMobileNumber || '',
        clientEmail: project.clientEmail || '',
        inquiryDate: project.inquiryDate ? new Date(project.inquiryDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        companyName: project.companyName || '',
        companyLocation: project.companyLocation || '',
        businessType: project.businessType || '',
        yourServices: project.yourServices || '',
        yearsInBusiness: project.yearsInBusiness || '',
        hasSalesTeam: project.hasSalesTeam !== undefined && project.hasSalesTeam !== null ? project.hasSalesTeam : null,
        hasSocialMedia: project.hasSocialMedia || false,
        socialMediaProfiles: project.socialMediaProfiles || { instagram: '', facebook: '', linkedin: '', other: '' },
        annualTurnover: project.annualTurnover || '',
        currentGoogleRanking: project.currentGoogleRanking || '',
        hasGoogleBusinessProfile: project.hasGoogleBusinessProfile !== undefined && project.hasGoogleBusinessProfile !== null ? project.hasGoogleBusinessProfile : true,
        hasClientDomain: project.hasClientDomain !== undefined && project.hasClientDomain !== null ? project.hasClientDomain : true,
        hasClientLogo: project.hasClientLogo !== undefined && project.hasClientLogo !== null ? project.hasClientLogo : true,
        hasClientContent: project.hasClientContent !== undefined && project.hasClientContent !== null ? project.hasClientContent : true,
        features: project.features || [],
        customFeatures: project.customFeatures || [],
        branch: project.branch || '',
        projectId: project.projectId || '',
        projectName: project.projectName || '',
        category: project.category || '',
        scopeOfWork: project.scopeOfWork || [],
        projectEndDate: project.projectEndDate ? new Date(project.projectEndDate).toISOString().split('T')[0] : '',
        projectDetails: project.projectDetails || '',
        numberOfPages: project.numberOfPages || '',
        technologies: project.technologies || { frontend: [], backend: [], database: [], other: [] },
        cost: projectCost,
        timeline: parsedTimeline,
      });

      if (project.scopeOfWorkDetails && project.scopeOfWorkDetails.length > 0) {
        setScopeItems(project.scopeOfWorkDetails.map(item => ({
          _id: item.scopeId,
          title: item.title,
          name: item.title,
          price: item.price,
        })));
      }

      setCalculatedCost(project.scopeCost || projectCost);
    }
  }, [project]);

  const parseTimeline = (timelineStr) => {
    if (!timelineStr) return { value: '', unit: 'Months' };
    const match = timelineStr.match(/(\d+)\s*(Days?|Weeks?|Months?)/i);
    if (match) {
      const unit = match[2].charAt(0).toUpperCase() + match[2].slice(1).toLowerCase();
      return { value: match[1], unit };
    }
    return { value: '', unit: 'Months' };
  };

  const validateIndianMobile = (mobile) => {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(mobile.replace(/\D/g, ''));
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateURL = (url) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = useCallback(() => {
    const newErrors = {};

    // Client Information Validation
    if (!formData.clientName?.trim()) newErrors.clientName = 'Client name is required';
    if (!formData.clientMobileNumber?.trim()) newErrors.clientMobileNumber = 'Mobile number is required';
    else if (!validateIndianMobile(formData.clientMobileNumber)) newErrors.clientMobileNumber = 'Invalid Indian mobile number (10 digits, starting with 6-9)';
    if (formData.clientEmail && !validateEmail(formData.clientEmail)) newErrors.clientEmail = 'Invalid email address';
    if (!formData.companyName?.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.businessType) newErrors.businessType = 'Business type is required';
    if (formData.yearsInBusiness && (formData.yearsInBusiness < 0 || formData.yearsInBusiness > 100)) 
      newErrors.yearsInBusiness = 'Years must be between 0 and 100';
    if (formData.hasSocialMedia) {
      if (formData.socialMediaProfiles?.instagram && !validateURL(formData.socialMediaProfiles.instagram)) 
        newErrors.instagramURL = 'Invalid Instagram URL';
      if (formData.socialMediaProfiles?.facebook && !validateURL(formData.socialMediaProfiles.facebook)) 
        newErrors.facebookURL = 'Invalid Facebook URL';
      if (formData.socialMediaProfiles?.linkedin && !validateURL(formData.socialMediaProfiles.linkedin)) 
        newErrors.linkedinURL = 'Invalid LinkedIn URL';
      if (formData.socialMediaProfiles?.other && !validateURL(formData.socialMediaProfiles.other)) 
        newErrors.otherURL = 'Invalid URL';
    }

    // Project Details Validation
    if (!formData.projectName?.trim()) newErrors.projectName = 'Project name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (formData.scopeOfWork?.length === 0) newErrors.scopeOfWork = 'Select at least one scope item';
    if (!formData.timeline?.value) newErrors.timeline = 'Timeline is required';
    if (formData.numberOfPages && (formData.numberOfPages < 0 || formData.numberOfPages > 1000)) 
      newErrors.numberOfPages = 'Pages must be between 0 and 1000';
    if (formData.technologies?.frontend?.length === 0) newErrors.frontendTech = 'Select at least one frontend technology';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const calculateCost = useCallback((selectedScopeNames, availableScopeItems) => {
    if (!selectedScopeNames?.length || !availableScopeItems?.length) {
      setCalculatedCost(0);
      return 0;
    }
    const total = availableScopeItems
      .filter((item) => selectedScopeNames.includes(item.title || item.name))
      .reduce((sum, item) => sum + (item.price || 0), 0);
    setCalculatedCost(total);
    return total;
  }, []);

  const calculateEndDate = useCallback(() => {
    if (!formData.timeline?.value) return;
    const startDate = new Date();
    const { value, unit } = formData.timeline;
    const days = unit === 'Days' ? parseInt(value) : unit === 'Weeks' ? parseInt(value) * 7 : parseInt(value) * 30;
    const endDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);
    setCalculatedEndDate(endDate.toISOString().split('T')[0]);
  }, [formData.timeline]);

  useEffect(() => {
    calculateEndDate();
  }, [formData.timeline, calculateEndDate]);

  const updateFormData = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Also update react-hook-form
    setValue(field, value);
  }, [setValue]);

  const updateNestedField = useCallback((parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
    setValue(`${parent}.${field}`, value);
  }, [setValue]);

  const formatTimelineString = () => {
    if (!formData.timeline?.value) return '';
    const unit = formData.timeline.unit.endsWith('s') ? formData.timeline.unit : formData.timeline.unit + 's';
    return `${formData.timeline.value} ${unit}`;
  };

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setScopeItems([]);
    setCalculatedCost(0);
    setCalculatedEndDate('');
    setErrors({});
    reset(initialFormData);
  }, [reset]);

  const getFormDataForSubmission = useCallback(() => {
    return {
      ...formData,
      timeline: formatTimelineString(),
      cost: calculatedCost,
      projectEndDate: calculatedEndDate,
    };
  }, [formData, calculatedCost, calculatedEndDate, formatTimelineString]);

  return {
    formData,
    setFormData,
    updateFormData,
    updateNestedField,
    scopeItems,
    setScopeItems,
    calculatedCost,
    setCalculatedCost,
    calculateCost,
    calculatedEndDate,
    setCalculatedEndDate,
    calculateEndDate,
    errors,
    setErrors,
    validateForm,
    validateIndianMobile,
    validateEmail,
    validateURL,
    formatTimelineString,
    register,
    handleSubmit,
    watch,
    formErrors,
    reset,
    resetForm,
    isSubmitting,
    setIsSubmitting,
    getFormDataForSubmission,
    setValue,
    getValues,
  };
};

export default useProjectForm;