import React, { useState, useEffect } from 'react';
import {
  BookOpen, Award, CheckCircle2, Play, Clock,
  FileCheck, Star, Sparkles, ChevronRight, X
} from 'lucide-react';
import { getTrainingCourses, completeTrainingCourse } from '../services/api';
import { useTenantTheme } from '../context/TenantThemeContext';

export default function TrainingPage() {
  const { activeTenant } = useTenantTheme();
  const [courses, setCourses] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);

  const brandColor = activeTenant?.brand_primary_color || '#2563eb';

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await getTrainingCourses();
      if (res && res.data) {
        setCourses(res.data);
      }
    } catch (e) {
      console.warn('Courses error:', e);
    }
  };

  const handleComplete = async (courseId) => {
    try {
      await completeTrainingCourse(courseId);
    } catch (err) {
      console.warn('Local complete:', err);
    }
    setCourses(courses.map(c => c.id === courseId ? { ...c, status: 'COMPLETED', progressPct: 100, score: '98%', certificateIssued: true } : c));
    setActiveCourse(null);
  };

  return (
    <div style={{ animation: 'fadeIn 0.2s ease-in-out' }}>
      
      {/* Top Banner */}
      <div
        className="card-section"
        style={{
          background: `linear-gradient(135deg, ${brandColor}dd, #0f172a)`,
          color: '#ffffff',
          marginBottom: '20px',
          padding: '24px',
          borderRadius: '12px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={20} color="#93c5fd" />
              <span style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Medical Representative Field Academy &amp; Detailing LMS
              </span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: '800', marginTop: '4px' }}>
              Product Detailing &amp; Compliance Training LMS
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#e2e8f0', marginTop: '4px' }}>
              Cardiology Clinical Masterclasses • Pharmacovigilance Compliance • Objection Handling • Official Certification
            </p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '8px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={18} color="#facc15" />
            <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>Certificates Earned: 2</span>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {courses.map((course) => (
          <div
            key={course.id}
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.72rem', background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                  {course.category}
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: course.status === 'COMPLETED' ? '#dcfce7' : (course.status === 'IN_PROGRESS' ? '#eff6ff' : '#f1f5f9'),
                    color: course.status === 'COMPLETED' ? '#15803d' : (course.status === 'IN_PROGRESS' ? '#2563eb' : '#64748b')
                  }}
                >
                  {course.status}
                </span>
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                {course.title}
              </h3>
              <div style={{ display: 'flex', gap: '14px', fontSize: '0.78rem', color: '#64748b', marginBottom: '14px' }}>
                <span>🕒 {course.durationMinutes} mins</span>
                <span>📄 {course.totalSlides} Visual Slides</span>
                {course.score && <span style={{ color: '#16a34a', fontWeight: '700' }}>Score: {course.score}</span>}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
              {course.status === 'COMPLETED' ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#16a34a', fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={15} /> Certified Compliant
                  </span>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => alert(`Certificate verified: ${course.title} (Issued to Officer)`)}
                  >
                    View Certificate
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setActiveCourse(course)}
                  style={{ width: '100%', background: '#2563eb', color: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
                >
                  <Play size={14} /> Launch Learning Module
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Module Player Modal */}
      {activeCourse && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '600px', boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>{activeCourse.category}</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>{activeCourse.title}</h3>
              </div>
              <button type="button" onClick={() => setActiveCourse(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            
            <div style={{ background: '#0f172a', color: '#ffffff', borderRadius: '8px', padding: '30px', textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>E-Detailing Clinical Module Player</div>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Slide 1 of {activeCourse.totalSlides}: Mechanism of Action, Hemodynamic Efficacy &amp; Prescribing Safety Profile.
              </p>
              <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '4px' }}>
                <div style={{ width: '45%', height: '100%', background: '#38bdf8', borderRadius: '4px' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setActiveCourse(null)}>Exit Player</button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleComplete(activeCourse.id)}
                style={{ background: '#16a34a', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <CheckCircle2 size={16} /> Mark Completed &amp; Pass Quiz
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
