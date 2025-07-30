import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Shared/AuthContext';

const UserProfile = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    skills: '',
    experience: '',
    education: '',
    interests: ''
  });
  const [pendingApplications, setPendingApplications] = useState({
    investor: false,
    startup: false
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    // Сначала пытаемся загрузить сохраненные данные профиля
    const savedProfileData = localStorage.getItem('userProfileData');
    if (savedProfileData) {
      try {
        const parsedData = JSON.parse(savedProfileData);
        setFormData({
          name: parsedData.name || user?.name || '',
          email: parsedData.email || user?.email || '',
          phone: parsedData.phone || user?.phone || '',
          bio: parsedData.bio || user?.bio || '',
          location: parsedData.location || user?.location || '',
          skills: parsedData.skills || user?.skills || '',
          experience: parsedData.experience || user?.experience || '',
          education: parsedData.education || user?.education || '',
          interests: parsedData.interests || user?.interests || ''
        });
      } catch (error) {
        console.error('Ошибка при загрузке сохраненных данных:', error);
      }
    } else if (user) {
      // Если сохраненных данных нет, используем данные пользователя
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.location || '',
        skills: user.skills || '',
        experience: user.experience || '',
        education: user.education || '',
        interests: user.interests || ''
      });
    }

    // Проверяем статус заявок
    const investorApp = localStorage.getItem('pendingInvestorApplication');
    const startupApp = localStorage.getItem('pendingStartupApplication');
    
    setPendingApplications({
      investor: investorApp ? JSON.parse(investorApp).submitted : false,
      startup: startupApp ? JSON.parse(startupApp).submitted : false
    });
  }, [user, token, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Сохраняем только данные профиля (без email)
      const profileData = {
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio,
        location: formData.location,
        skills: formData.skills,
        experience: formData.experience,
        education: formData.education,
        interests: formData.interests
      };
      
      // Сохраняем в localStorage
      localStorage.setItem('userProfileData', JSON.stringify(profileData));
      
      setIsEditing(false);
      
      // Показываем уведомление об успешном сохранении
      alert('Профиль успешно сохранен!');
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при сохранении профиля');
    }
  };



  const handleBecomeInvestor = () => {
    navigate('/investor-application');
  };

  const handleBecomeStartup = () => {
    navigate('/startup-application');
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
          Профиль пользователя
        </h1>

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
                Имя
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
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
              ) : (
                <div style={{
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: '#f9fafb',
                  color: '#222',
                  fontSize: '1rem',
                  fontWeight: 300
                }}>
                  {formData.name || 'Не указано'}
                </div>
              )}
            </div>



            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#6b7280',
                fontSize: '0.875rem',
                fontWeight: 300
              }}>
                Телефон
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
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
              ) : (
                <div style={{
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: '#f9fafb',
                  color: '#222',
                  fontSize: '1rem',
                  fontWeight: 300
                }}>
                  {formData.phone || 'Не указано'}
                </div>
              )}
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#6b7280',
                fontSize: '0.875rem',
                fontWeight: 300
              }}>
                Местоположение
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
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
              ) : (
                <div style={{
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: '#f9fafb',
                  color: '#222',
                  fontSize: '1rem',
                  fontWeight: 300
                }}>
                  {formData.location || 'Не указано'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* О себе */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 300,
            color: '#222',
            marginBottom: '20px',
            fontFamily: 'Playfair Display, serif',
            fontStyle: 'normal'
          }}>
            О себе
          </h2>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#6b7280',
              fontSize: '0.875rem',
              fontWeight: 300
            }}>
              Краткая биография
            </label>
            {isEditing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
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
            ) : (
              <div style={{
                padding: '12px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: '#f9fafb',
                color: '#222',
                fontSize: '1rem',
                fontWeight: 300,
                minHeight: '100px'
              }}>
                {formData.bio || 'Не указано'}
              </div>
            )}
          </div>
        </div>

        {/* Навыки и опыт */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 300,
            color: '#222',
            marginBottom: '20px',
            fontFamily: 'Playfair Display, serif',
            fontStyle: 'normal'
          }}>
            Навыки и опыт
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
                Навыки
              </label>
              {isEditing ? (
                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Укажите ваши навыки через запятую"
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
              ) : (
                <div style={{
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: '#f9fafb',
                  color: '#222',
                  fontSize: '1rem',
                  fontWeight: 300,
                  minHeight: '80px'
                }}>
                  {formData.skills || 'Не указано'}
                </div>
              )}
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#6b7280',
                fontSize: '0.875rem',
                fontWeight: 300
              }}>
                Опыт работы
              </label>
              {isEditing ? (
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Опишите ваш опыт работы"
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
              ) : (
                <div style={{
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: '#f9fafb',
                  color: '#222',
                  fontSize: '1rem',
                  fontWeight: 300,
                  minHeight: '80px'
                }}>
                  {formData.experience || 'Не указано'}
                </div>
              )}
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#6b7280',
                fontSize: '0.875rem',
                fontWeight: 300
              }}>
                Образование
              </label>
              {isEditing ? (
                <textarea
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Укажите ваше образование"
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
              ) : (
                <div style={{
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: '#f9fafb',
                  color: '#222',
                  fontSize: '1rem',
                  fontWeight: 300,
                  minHeight: '80px'
                }}>
                  {formData.education || 'Не указано'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Интересы */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 300,
            color: '#222',
            marginBottom: '20px',
            fontFamily: 'Playfair Display, serif',
            fontStyle: 'normal'
          }}>
            Интересы
          </h2>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#6b7280',
              fontSize: '0.875rem',
              fontWeight: 300
            }}>
              Области интересов
            </label>
            {isEditing ? (
              <textarea
                name="interests"
                value={formData.interests}
                onChange={handleInputChange}
                rows={3}
                placeholder="Укажите ваши интересы через запятую"
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
            ) : (
              <div style={{
                padding: '12px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: '#f9fafb',
                color: '#222',
                fontSize: '1rem',
                fontWeight: 300,
                minHeight: '80px'
              }}>
                {formData.interests || 'Не указано'}
              </div>
            )}
          </div>
        </div>

        {/* Кнопки действий */}
        <div style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          marginBottom: '40px'
        }}>
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                style={{
                  backgroundColor: '#FFD700',
                  color: '#222',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '1rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  minHeight: '48px'
                }}
              >
                Сохранить изменения
              </button>
              <button
                onClick={() => setIsEditing(false)}
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
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              style={{
                backgroundColor: '#FFD700',
                color: '#222',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                minHeight: '48px'
              }}
            >
              Редактировать профиль
            </button>
          )}
        </div>

        {/* Дополнительные возможности */}
        <div style={{
          borderTop: '1px solid #e5e7eb',
          paddingTop: '40px'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 300,
            color: '#222',
            marginBottom: '20px',
            fontFamily: 'Playfair Display, serif',
            fontStyle: 'normal'
          }}>
            Дополнительные возможности
          </h2>

          <p style={{
            color: '#6b7280',
            fontSize: '1rem',
            fontWeight: 300,
            lineHeight: 1.5,
            marginBottom: '24px'
          }}>
            Выберите, кем хотите стать в экосистеме SilkGate. После одобрения заявки администратором вы получите доступ к соответствующему дашборду:
          </p>

          <div style={{
            display: 'grid',
            gap: '16px',
            gridTemplateColumns: '1fr 1fr'
          }}>
            {pendingApplications.investor ? (
              <div style={{
                backgroundColor: '#f3f4f6',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px 24px',
                fontSize: '1rem',
                fontWeight: 300,
                color: '#6b7280',
                minHeight: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}>
                Заявка на роль инвестора отправлена
              </div>
            ) : (
              <button
                onClick={handleBecomeInvestor}
                style={{
                  backgroundColor: '#FFD700',
                  color: '#222',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '16px 24px',
                  fontSize: '1rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  minHeight: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                Стать инвестором
              </button>
            )}

            {pendingApplications.startup ? (
              <div style={{
                backgroundColor: '#f3f4f6',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px 24px',
                fontSize: '1rem',
                fontWeight: 300,
                color: '#6b7280',
                minHeight: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}>
                Заявка на роль стартапера отправлена
              </div>
            ) : (
              <button
                onClick={handleBecomeStartup}
                style={{
                  backgroundColor: '#FFD700',
                  color: '#222',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '16px 24px',
                  fontSize: '1rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  minHeight: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                Стать стартапером
              </button>
            )}
          </div>
        </div>


      </div>
    </div>
  );
};

export default UserProfile; 