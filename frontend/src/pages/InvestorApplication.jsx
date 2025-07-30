import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Shared/AuthContext';

const InvestorApplication = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    investorType: '',
    investmentRange: '',
    preferredSectors: '',
    investmentExperience: '',
    portfolioCompanies: '',
    investmentCriteria: '',
    contactPhone: '',
    companyName: '',
    position: '',
    linkedinProfile: '',
    website: '',
    additionalInfo: ''
  });

  const INVESTOR_TYPES = [
    { value: 'angel', label: 'Ангел (Angel)' },
    { value: 'vc', label: 'Венчурный фонд (VC)' },
    { value: 'family', label: 'Семейный офис (Family Office)' },
    { value: 'corporate', label: 'Корпоративный инвестор (Corporate)' },
    { value: 'private', label: 'Частный инвестор (Private)' },
    { value: 'club', label: 'Инвестиционный клуб (Club)' },
    { value: 'grant', label: 'Грантовый фонд (Grant Fund)' },
    { value: 'crowdfunding', label: 'Краудфандинг (Crowdfunding)' },
    { value: 'other', label: 'Другое (Other)' },
  ];

  const INVESTMENT_RANGES = [
    { value: 'under_50k', label: 'До $50,000' },
    { value: '50k_100k', label: '$50,000 - $100,000' },
    { value: '100k_500k', label: '$100,000 - $500,000' },
    { value: '500k_1m', label: '$500,000 - $1,000,000' },
    { value: '1m_5m', label: '$1,000,000 - $5,000,000' },
    { value: 'over_5m', label: 'Более $5,000,000' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const investorData = {
        userId: user.id,
        email: user.email,
        ...formData
      };

      const response = await fetch('/api/investors/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(investorData)
      });

      if (response.ok) {
        const result = await response.json();
        alert('Заявка на роль инвестора успешно отправлена! Ожидайте одобрения от администратора.');
        
        // Сохраняем информацию о заявке в localStorage
        localStorage.setItem('pendingInvestorApplication', JSON.stringify({
          submitted: true,
          timestamp: new Date().toISOString(),
          status: 'pending'
        }));
        
        navigate('/profile');
      } else {
        const error = await response.json();
        alert(error.message || 'Ошибка при отправке заявки');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при отправке заявки');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Загрузка...</div>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#10182A',
      padding: '20px',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 300
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '48px 40px',
        boxShadow: 'none'
      }}>
        {/* Заголовок */}
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 300,
          lineHeight: 1.2,
          letterSpacing: 0,
          color: '#222',
          marginBottom: '32px',
          fontFamily: 'Playfair Display, serif',
          fontStyle: 'normal'
        }}>
          Заявка на роль инвестора
        </h1>

        <p style={{
          color: '#6b7280',
          fontSize: '1rem',
          fontWeight: 300,
          lineHeight: 1.5,
          marginBottom: '40px'
        }}>
          Заполните анкету, чтобы стать инвестором в экосистеме SilkGate
        </p>

        <form onSubmit={handleSubmit}>
          {/* Основная информация */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 300,
              color: '#222',
              marginBottom: '20px',
              fontFamily: 'Playfair Display, serif',
              fontStyle: 'normal'
            }}>
              Основная информация
            </h2>

            <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr 1fr' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  fontWeight: 300
                }}>
                  Тип инвестора *
                </label>
                <select
                  name="investorType"
                  value={formData.investorType}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    minHeight: '48px',
                    fontWeight: 300,
                    color: '#222',
                    boxSizing: 'border-box',
                    fontFamily: 'Inter, sans-serif',
                    padding: '12px 16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    backgroundColor: '#FFFFFF'
                  }}
                >
                  <option value="">Выберите тип инвестора</option>
                  {INVESTOR_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  fontWeight: 300
                }}>
                  Диапазон инвестиций *
                </label>
                <select
                  name="investmentRange"
                  value={formData.investmentRange}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    minHeight: '48px',
                    fontWeight: 300,
                    color: '#222',
                    boxSizing: 'border-box',
                    fontFamily: 'Inter, sans-serif',
                    padding: '12px 16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    backgroundColor: '#FFFFFF'
                  }}
                >
                  <option value="">Выберите диапазон</option>
                  {INVESTMENT_RANGES.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  fontWeight: 300
                }}>
                  Название компании
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Название вашей компании"
                  style={{
                    width: '100%',
                    minHeight: '48px',
                    fontWeight: 300,
                    color: '#222',
                    boxSizing: 'border-box',
                    fontFamily: 'Inter, sans-serif',
                    padding: '12px 16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  fontWeight: 300
                }}>
                  Должность
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  placeholder="Ваша должность"
                  style={{
                    width: '100%',
                    minHeight: '48px',
                    fontWeight: 300,
                    color: '#222',
                    boxSizing: 'border-box',
                    fontFamily: 'Inter, sans-serif',
                    padding: '12px 16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  fontWeight: 300
                }}>
                  Телефон для связи *
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  placeholder="+7 (999) 123-45-67"
                  required
                  style={{
                    width: '100%',
                    minHeight: '48px',
                    fontWeight: 300,
                    color: '#222',
                    boxSizing: 'border-box',
                    fontFamily: 'Inter, sans-serif',
                    padding: '12px 16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  fontWeight: 300
                }}>
                  LinkedIn профиль
                </label>
                <input
                  type="url"
                  name="linkedinProfile"
                  value={formData.linkedinProfile}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/username"
                  style={{
                    width: '100%',
                    minHeight: '48px',
                    fontWeight: 300,
                    color: '#222',
                    boxSizing: 'border-box',
                    fontFamily: 'Inter, sans-serif',
                    padding: '12px 16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Инвестиционная информация */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 300,
              color: '#222',
              marginBottom: '20px',
              fontFamily: 'Playfair Display, serif',
              fontStyle: 'normal'
            }}>
              Инвестиционная информация
            </h2>

            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  fontWeight: 300
                }}>
                  Предпочитаемые секторы *
                </label>
                <textarea
                  name="preferredSectors"
                  value={formData.preferredSectors}
                  onChange={handleInputChange}
                  placeholder="Например: FinTech, EdTech, HealthTech, AI/ML, E-commerce"
                  required
                  rows={3}
                  style={{
                    width: '100%',
                    fontWeight: 300,
                    color: '#222',
                    boxSizing: 'border-box',
                    fontFamily: 'Inter, sans-serif',
                    padding: '12px 16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  fontWeight: 300
                }}>
                  Опыт инвестирования *
                </label>
                <textarea
                  name="investmentExperience"
                  value={formData.investmentExperience}
                  onChange={handleInputChange}
                  placeholder="Опишите ваш опыт инвестирования в стартапы"
                  required
                  rows={4}
                  style={{
                    width: '100%',
                    fontWeight: 300,
                    color: '#222',
                    boxSizing: 'border-box',
                    fontFamily: 'Inter, sans-serif',
                    padding: '12px 16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  fontWeight: 300
                }}>
                  Портфельные компании
                </label>
                <textarea
                  name="portfolioCompanies"
                  value={formData.portfolioCompanies}
                  onChange={handleInputChange}
                  placeholder="Список компаний в вашем портфеле (если есть)"
                  rows={3}
                  style={{
                    width: '100%',
                    fontWeight: 300,
                    color: '#222',
                    boxSizing: 'border-box',
                    fontFamily: 'Inter, sans-serif',
                    padding: '12px 16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  fontWeight: 300
                }}>
                  Критерии инвестирования *
                </label>
                <textarea
                  name="investmentCriteria"
                  value={formData.investmentCriteria}
                  onChange={handleInputChange}
                  placeholder="Опишите ваши критерии для инвестирования в стартапы"
                  required
                  rows={4}
                  style={{
                    width: '100%',
                    fontWeight: 300,
                    color: '#222',
                    boxSizing: 'border-box',
                    fontFamily: 'Inter, sans-serif',
                    padding: '12px 16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Дополнительная информация */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 300,
              color: '#222',
              marginBottom: '20px',
              fontFamily: 'Playfair Display, serif',
              fontStyle: 'normal'
            }}>
              Дополнительная информация
            </h2>

            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  fontWeight: 300
                }}>
                  Веб-сайт
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  style={{
                    width: '100%',
                    minHeight: '48px',
                    fontWeight: 300,
                    color: '#222',
                    boxSizing: 'border-box',
                    fontFamily: 'Inter, sans-serif',
                    padding: '12px 16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  fontWeight: 300
                }}>
                  Дополнительная информация
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  placeholder="Любая дополнительная информация, которую вы хотите предоставить"
                  rows={4}
                  style={{
                    width: '100%',
                    fontWeight: 300,
                    color: '#222',
                    boxSizing: 'border-box',
                    fontFamily: 'Inter, sans-serif',
                    padding: '12px 16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Кнопки */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              style={{
                backgroundColor: 'transparent',
                color: '#6b7280',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: 300,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                minHeight: '48px'
              }}
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#FFD700',
                color: '#222',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, sans-serif',
                minHeight: '48px',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Отправка...' : 'Отправить заявку'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvestorApplication; 