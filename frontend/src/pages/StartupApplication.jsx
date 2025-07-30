import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Shared/AuthContext';

const StartupApplication = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    startupName: '',
    industry: '',
    stage: '',
    description: '',
    problem: '',
    solution: '',
    targetMarket: '',
    businessModel: '',
    teamSize: '',
    fundingNeeded: '',
    currentFunding: '',
    revenue: '',
    traction: '',
    competitors: '',
    contactPhone: '',
    website: '',
    pitchDeck: '',
    additionalInfo: ''
  });

  const INDUSTRIES = [
    { value: 'fintech', label: 'FinTech' },
    { value: 'edtech', label: 'EdTech' },
    { value: 'healthtech', label: 'HealthTech' },
    { value: 'ai_ml', label: 'AI/ML' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'saas', label: 'SaaS' },
    { value: 'iot', label: 'IoT' },
    { value: 'blockchain', label: 'Blockchain' },
    { value: 'cybersecurity', label: 'Cybersecurity' },
    { value: 'clean_tech', label: 'CleanTech' },
    { value: 'biotech', label: 'BioTech' },
    { value: 'other', label: 'Другое' },
  ];

  const STAGES = [
    { value: 'idea', label: 'Идея' },
    { value: 'mvp', label: 'MVP' },
    { value: 'early_traction', label: 'Ранние пользователи' },
    { value: 'growth', label: 'Рост' },
    { value: 'scale', label: 'Масштабирование' },
  ];

  const TEAM_SIZES = [
    { value: '1_2', label: '1-2 человека' },
    { value: '3_5', label: '3-5 человек' },
    { value: '6_10', label: '6-10 человек' },
    { value: '11_25', label: '11-25 человек' },
    { value: '26_50', label: '26-50 человек' },
    { value: 'over_50', label: 'Более 50 человек' },
  ];

  const FUNDING_NEEDS = [
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
      const startupData = {
        userId: user.id,
        email: user.email,
        ...formData
      };

      const response = await fetch('/api/startups/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(startupData)
      });

      if (response.ok) {
        const result = await response.json();
        alert('Заявка на роль стартапера успешно отправлена! Ожидайте одобрения от администратора.');
        
        // Сохраняем информацию о заявке в localStorage
        localStorage.setItem('pendingStartupApplication', JSON.stringify({
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
          Заявка на роль стартапера
        </h1>

        <p style={{
          color: '#6b7280',
          fontSize: '1rem',
          fontWeight: 300,
          lineHeight: 1.5,
          marginBottom: '40px'
        }}>
          Заполните анкету, чтобы представить ваш стартап в экосистеме SilkGate
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
                  Название стартапа *
                </label>
                <input
                  type="text"
                  name="startupName"
                  value={formData.startupName}
                  onChange={handleInputChange}
                  placeholder="Название вашего стартапа"
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
                  Отрасль *
                </label>
                <select
                  name="industry"
                  value={formData.industry}
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
                  <option value="">Выберите отрасль</option>
                  {INDUSTRIES.map(industry => (
                    <option key={industry.value} value={industry.value}>
                      {industry.label}
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
                  Стадия развития *
                </label>
                <select
                  name="stage"
                  value={formData.stage}
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
                  <option value="">Выберите стадию</option>
                  {STAGES.map(stage => (
                    <option key={stage.value} value={stage.value}>
                      {stage.label}
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
                  Размер команды *
                </label>
                <select
                  name="teamSize"
                  value={formData.teamSize}
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
                  <option value="">Выберите размер команды</option>
                  {TEAM_SIZES.map(size => (
                    <option key={size.value} value={size.value}>
                      {size.label}
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
            </div>
          </div>

          {/* Описание проекта */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 300,
              color: '#222',
              marginBottom: '20px',
              fontFamily: 'Playfair Display, serif',
              fontStyle: 'normal'
            }}>
              Описание проекта
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
                  Краткое описание *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Краткое описание вашего стартапа (1-2 предложения)"
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
                  Проблема *
                </label>
                <textarea
                  name="problem"
                  value={formData.problem}
                  onChange={handleInputChange}
                  placeholder="Какую проблему решает ваш стартап?"
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
                  Решение *
                </label>
                <textarea
                  name="solution"
                  value={formData.solution}
                  onChange={handleInputChange}
                  placeholder="Как ваше решение решает эту проблему?"
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
                  Целевой рынок *
                </label>
                <textarea
                  name="targetMarket"
                  value={formData.targetMarket}
                  onChange={handleInputChange}
                  placeholder="Опишите ваш целевой рынок"
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
                  Бизнес-модель *
                </label>
                <textarea
                  name="businessModel"
                  value={formData.businessModel}
                  onChange={handleInputChange}
                  placeholder="Как вы планируете зарабатывать?"
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
            </div>
          </div>

          {/* Финансы и тракция */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 300,
              color: '#222',
              marginBottom: '20px',
              fontFamily: 'Playfair Display, serif',
              fontStyle: 'normal'
            }}>
              Финансы и тракция
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
                  Требуемые инвестиции *
                </label>
                <select
                  name="fundingNeeded"
                  value={formData.fundingNeeded}
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
                  <option value="">Выберите сумму</option>
                  {FUNDING_NEEDS.map(funding => (
                    <option key={funding.value} value={funding.value}>
                      {funding.label}
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
                  Текущее финансирование
                </label>
                <input
                  type="text"
                  name="currentFunding"
                  value={formData.currentFunding}
                  onChange={handleInputChange}
                  placeholder="Сколько уже привлечено"
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
                  Выручка (если есть)
                </label>
                <input
                  type="text"
                  name="revenue"
                  value={formData.revenue}
                  onChange={handleInputChange}
                  placeholder="Месячная/годовая выручка"
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
                  Тракция
                </label>
                <input
                  type="text"
                  name="traction"
                  value={formData.traction}
                  onChange={handleInputChange}
                  placeholder="Количество пользователей, клиентов и т.д."
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

          {/* Конкуренция и дополнительная информация */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 300,
              color: '#222',
              marginBottom: '20px',
              fontFamily: 'Playfair Display, serif',
              fontStyle: 'normal'
            }}>
              Конкуренция и дополнительная информация
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
                  Конкуренты
                </label>
                <textarea
                  name="competitors"
                  value={formData.competitors}
                  onChange={handleInputChange}
                  placeholder="Основные конкуренты и ваши преимущества"
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
                  Ссылка на Pitch Deck
                </label>
                <input
                  type="url"
                  name="pitchDeck"
                  value={formData.pitchDeck}
                  onChange={handleInputChange}
                  placeholder="Ссылка на презентацию (Google Drive, Dropbox и т.д.)"
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
                  placeholder="Любая дополнительная информация о вашем стартапе"
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

export default StartupApplication; 