import React, { useState } from 'react';
import { useToast } from '../components/Shared/ToastProvider';

const INTERESTS = [
  'Fintech', 'AI', 'Marketing', 'Healthcare', 'EdTech', 'E-commerce', 'SaaS', 'Другое'
];
const STAGES = [
  'Pre-seed', 'Seed', 'Series A', 'Growth', 'Exit', 'Другое'
];
const GEO = [
  'Казахстан', 'СНГ', 'Европа', 'Азия', 'Другое'
];
const DEAL_TYPES = [
  'Equity', 'SAFE', 'Convertible Note', 'Grant', 'Другое'
];

export default function InvestorRegister() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    location: '',
    investorType: '',
    investmentRangeMin: '',
    investmentRangeMax: '',
    interests: [],
    interestsOther: '',
    preferredStages: [],
    preferredStagesOther: '',
    geoFocus: [],
    geoFocusOther: '',
    dealType: [],
    dealTypeOther: '',
    publicProfile: false,
    bio: '',
    linkedin: '',
    telegram: '',
    password: '',
    ndaAccepted: false,
    showPassword: false,
  });
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleCheckbox = (name, value) => {
    setForm(f => {
      const arr = f[name];
      if (arr.includes(value)) {
        return { ...f, [name]: arr.filter(v => v !== value) };
      } else {
        return { ...f, [name]: [...arr, value] };
      }
    });
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Имя обязательно';
    if (!form.email) newErrors.email = 'Email обязателен';
    if (!form.password) newErrors.password = 'Пароль обязателен';
    if (!form.ndaAccepted) newErrors.ndaAccepted = 'Необходимо принять NDA';
    if (!form.investorType) newErrors.investorType = 'Тип инвестора обязателен';
    if (!form.investmentRangeMin || !form.investmentRangeMax) newErrors.investmentRange = 'Укажите диапазон инвестиций';
    if (form.interests.length === 0 && !form.interestsOther) newErrors.interests = 'Выберите хотя бы один интерес';
    return newErrors;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.showToast('Заполните обязательные поля', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/investors/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          location: form.location,
          investorType: form.investorType,
          investmentRange: {
            min: Number(form.investmentRangeMin) || 0,
            max: Number(form.investmentRangeMax) || 0,
          },
          interests: [
            ...form.interests.filter(i => i !== 'Другое'),
            ...(form.interests.includes('Другое') && form.interestsOther ? [form.interestsOther] : [])
          ],
          preferredStages: [
            ...form.preferredStages.filter(i => i !== 'Другое'),
            ...(form.preferredStages.includes('Другое') && form.preferredStagesOther ? [form.preferredStagesOther] : [])
          ],
          geoFocus: [
            ...form.geoFocus.filter(i => i !== 'Другое'),
            ...(form.geoFocus.includes('Другое') && form.geoFocusOther ? [form.geoFocusOther] : [])
          ],
          dealType: [
            ...form.dealType.filter(i => i !== 'Другое'),
            ...(form.dealType.includes('Другое') && form.dealTypeOther ? [form.dealTypeOther] : [])
          ],
          publicProfile: form.publicProfile,
          bio: form.bio,
          contactLinks: {
            linkedin: form.linkedin,
            telegram: form.telegram,
          },
          password: form.password,
          ndaAccepted: form.ndaAccepted,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Ошибка регистрации');
      toast.showToast('Спасибо за вашу заявку! Мы рассмотрим её и свяжемся с вами по email.', 'success');
    } catch (err) {
      toast.showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const errorStyle = err => err ? { background: '#ffe5e5' } : {};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#10182A] px-2 sm:px-0">
      <div className="w-full max-w-xs sm:max-w-md p-4 sm:p-8 bg-[#F5F6FA] rounded-lg shadow">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-[#10182A]">
          Регистрация инвестора
        </h2>
        <form onSubmit={handleSubmit} noValidate>
          <input style={errorStyle(errors.name)} className="w-full mb-1 px-4 py-2 border rounded bg-white text-[#10182A] placeholder-gray-400" name="name" value={form.name} onChange={handleChange} type="text" placeholder="Имя*" />
          {errors.name && <div className="text-xs text-red-500 mb-2">{errors.name}</div>}
          <input style={errorStyle(errors.email)} className="w-full mb-1 px-4 py-2 border rounded bg-white text-[#10182A] placeholder-gray-400" name="email" value={form.email} onChange={handleChange} type="email" placeholder="Email*" />
          {errors.email && <div className="text-xs text-red-500 mb-2">{errors.email}</div>}
          <div className="text-xs text-gray-500 mb-2">Введите действующий email для связи и восстановления доступа</div>
          <input className="w-full mb-4 px-4 py-2 border rounded bg-white text-[#10182A] placeholder-gray-400" name="location" value={form.location} onChange={handleChange} type="text" placeholder="Локация" />
          <select style={errorStyle(errors.investorType)} className="w-full mb-1 px-3 py-2 border rounded text-sm bg-white text-[#10182A]" name="investorType" value={form.investorType} onChange={handleChange}>
            <option value="">Выберите тип инвестора*</option>
            <option value="Ангел">Ангел (Angel)</option>
            <option value="Венчурный фонд">Венчурный фонд (VC)</option>
            <option value="Семейный офис">Семейный офис (Family Office)</option>
            <option value="Корпоративный инвестор">Корпоративный инвестор (Corporate)</option>
            <option value="Частный инвестор">Частный инвестор (Private)</option>
            <option value="Инвестиционный клуб">Инвестиционный клуб (Club)</option>
            <option value="Грантовый фонд">Грантовый фонд (Grant Fund)</option>
            <option value="Краудфандинг">Краудфандинг (Crowdfunding)</option>
            <option value="Другое">Другое (Other)</option>
          </select>
          {errors.investorType && <div className="text-xs text-red-500 mb-2">{errors.investorType}</div>}
          <div className="flex gap-2 mb-1">
            <input style={errorStyle(errors.investmentRange)} className="w-1/2 px-4 py-2 border rounded bg-white text-[#10182A] placeholder-gray-400" name="investmentRangeMin" value={form.investmentRangeMin} onChange={handleChange} type="number" placeholder="Мин. инвестиции*" />
            <input style={errorStyle(errors.investmentRange)} className="w-1/2 px-4 py-2 border rounded bg-white text-[#10182A] placeholder-gray-400" name="investmentRangeMax" value={form.investmentRangeMax} onChange={handleChange} type="number" placeholder="Макс. инвестиции*" />
          </div>
          {errors.investmentRange && <div className="text-xs text-red-500 mb-2">{errors.investmentRange}</div>}

          {/* Интересы */}
          <div className="mb-1 font-semibold text-[#10182A]">Интересы*</div>
          <div className="flex flex-wrap gap-2 mb-1">
            {INTERESTS.map(i => (
              <label key={i} className="flex items-center gap-1 text-sm">
                <input type="checkbox" checked={form.interests.includes(i)} onChange={() => handleCheckbox('interests', i)} /> {i}
              </label>
            ))}
          </div>
          {form.interests.includes('Другое') && (
            <input className="w-full mb-1 px-4 py-2 border rounded bg-white text-[#10182A] placeholder-gray-400" name="interestsOther" value={form.interestsOther} onChange={handleChange} type="text" placeholder="Свой вариант" />
          )}
          {errors.interests && <div className="text-xs text-red-500 mb-2">{errors.interests}</div>}

          {/* Стадии */}
          <div className="mb-1 font-semibold text-[#10182A]">Стадии</div>
          <div className="flex flex-wrap gap-2 mb-1">
            {STAGES.map(i => (
              <label key={i} className="flex items-center gap-1 text-sm">
                <input type="checkbox" checked={form.preferredStages.includes(i)} onChange={() => handleCheckbox('preferredStages', i)} /> {i}
              </label>
            ))}
          </div>
          {form.preferredStages.includes('Другое') && (
            <input className="w-full mb-1 px-4 py-2 border rounded bg-white text-[#10182A] placeholder-gray-400" name="preferredStagesOther" value={form.preferredStagesOther} onChange={handleChange} type="text" placeholder="Свой вариант" />
          )}

          {/* География */}
          <div className="mb-1 font-semibold text-[#10182A]">География</div>
          <div className="flex flex-wrap gap-2 mb-1">
            {GEO.map(i => (
              <label key={i} className="flex items-center gap-1 text-sm">
                <input type="checkbox" checked={form.geoFocus.includes(i)} onChange={() => handleCheckbox('geoFocus', i)} /> {i}
              </label>
            ))}
          </div>
          {form.geoFocus.includes('Другое') && (
            <input className="w-full mb-1 px-4 py-2 border rounded bg-white text-[#10182A] placeholder-gray-400" name="geoFocusOther" value={form.geoFocusOther} onChange={handleChange} type="text" placeholder="Свой вариант" />
          )}

          {/* Типы сделок */}
          <div className="mb-1 font-semibold text-[#10182A]">Типы сделок</div>
          <div className="flex flex-wrap gap-2 mb-1">
            {DEAL_TYPES.map(i => (
              <label key={i} className="flex items-center gap-1 text-sm">
                <input type="checkbox" checked={form.dealType.includes(i)} onChange={() => handleCheckbox('dealType', i)} /> {i}
              </label>
            ))}
          </div>
          {form.dealType.includes('Другое') && (
            <input className="w-full mb-1 px-4 py-2 border rounded bg-white text-[#10182A] placeholder-gray-400" name="dealTypeOther" value={form.dealTypeOther} onChange={handleChange} type="text" placeholder="Свой вариант" />
          )}

          <div className="flex items-center mb-4">
            <input type="checkbox" name="publicProfile" checked={form.publicProfile} onChange={handleChange} className="mr-2" />
            <span className="text-sm text-[#10182A]">Показывать профиль публично</span>
          </div>
          <textarea className="w-full mb-4 px-4 py-2 border rounded bg-white text-[#10182A] placeholder-gray-400" name="bio" value={form.bio} onChange={handleChange} placeholder="Краткая информация о себе" rows={2} />
          <input className="w-full mb-4 px-4 py-2 border rounded bg-white text-[#10182A] placeholder-gray-400" name="linkedin" value={form.linkedin} onChange={handleChange} type="text" placeholder="LinkedIn" />
          <input className="w-full mb-4 px-4 py-2 border rounded bg-white text-[#10182A] placeholder-gray-400" name="telegram" value={form.telegram} onChange={handleChange} type="text" placeholder="Telegram" />
          <div className="flex items-center mb-4">
            <input type="checkbox" name="ndaAccepted" checked={form.ndaAccepted} onChange={handleChange} className="mr-2" />
            <span className="text-sm text-[#10182A]">Я принимаю NDA</span>
          </div>
          <div className="relative mb-4">
            <input
              style={errorStyle(errors.password)}
              className="w-full px-4 py-2 border rounded bg-white text-[#10182A] placeholder-gray-400 pr-10"
              name="password"
              value={form.password}
              onChange={handleChange}
              type={form.showPassword ? 'text' : 'password'}
              placeholder="Пароль*"
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#10182A]"
              onClick={() => setForm(f => ({ ...f, showPassword: !f.showPassword }))}
              title={form.showPassword ? 'Скрыть пароль' : 'Показать пароль'}
            >
              {form.showPassword ? '👁️' : '👁'}
            </span>
          </div>
          {errors.password && <div className="text-xs text-red-500 mb-2">{errors.password}</div>}
          <button className="w-full py-2 bg-[#FFD700] text-[#10182A] rounded font-semibold hover:bg-yellow-400 transition text-base mt-2" type="submit" disabled={loading}>
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
          <div className="mt-6 text-center text-sm text-[#10182A]">
            Или зарегистрируйтесь через{' '}
            <a href="#" onClick={e => { e.preventDefault(); toast.showToast('Google Auth скоро будет доступен', 'info'); }} className="text-blue-600 hover:underline font-semibold">Google</a>
          </div>
        </form>
      </div>
    </div>
  );
} 