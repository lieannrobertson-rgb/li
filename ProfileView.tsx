import React, { useState, useEffect } from 'react';
import { CatProfile } from '../../types';
import { storage, compressImage, calculateAge } from '../../utils';
import { Card } from '../ui/Card';
import { Icons } from '../../constants';
import { Button } from '../ui/Button';

export const ProfileView: React.FC = () => {
  const [profile, setProfile] = useState<CatProfile>(storage.getProfile());
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (field: keyof CatProfile, value: string) => {
    const newProfile = { ...profile, [field]: value };
    setProfile(newProfile);
    storage.setProfile(newProfile);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await compressImage(file);
        handleChange('avatar', base64);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const age = calculateAge(profile.birthDate);

  return (
    <div className="space-y-6 pb-20">
      <Card className="flex flex-col items-center bg-gradient-to-b from-white to-neko-cream">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-neko-orange shadow-lg bg-gray-100 flex items-center justify-center">
             {profile.avatar ? (
               <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
             ) : (
               <Icons.Paw className="w-16 h-16 text-neko-pink opacity-50" />
             )}
          </div>
          <label className="absolute bottom-0 right-0 bg-neko-blue p-2 rounded-full cursor-pointer hover:bg-blue-400 text-white shadow-md">
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <Icons.Edit />
          </label>
        </div>
        
        {isEditing ? (
           <input 
            type="text" 
            value={profile.name} 
            onChange={(e) => handleChange('name', e.target.value)}
            className="mt-4 text-center text-2xl font-bold text-gray-800 border-b-2 border-neko-orange focus:outline-none bg-transparent"
           />
        ) : (
           <h1 className="mt-4 text-2xl font-bold text-gray-800">{profile.name}</h1>
        )}
        
        <div className="flex gap-2 mt-2">
          <span className={`px-3 py-1 rounded-full text-sm font-bold text-white ${profile.gender === 'boy' ? 'bg-blue-400' : 'bg-neko-pink'}`}>
            {profile.gender === 'boy' ? '♂ 男孩' : '♀ 女孩'}
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-bold bg-neko-orange text-white">
            {age}
          </span>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title={<><Icons.Paw className="w-5 h-5 text-neko-orange"/> 基本信息</>}>
          <div className="space-y-4">
            <Field label="生日">
               <input 
                 type="date" 
                 value={profile.birthDate} 
                 onChange={(e) => handleChange('birthDate', e.target.value)}
                 className="w-full bg-transparent text-right outline-none text-gray-600"
               />
            </Field>
            <Field label="性别">
              <select 
                value={profile.gender}
                onChange={(e) => handleChange('gender', e.target.value as 'boy'|'girl')}
                className="w-full bg-transparent text-right outline-none text-gray-600 appearance-none"
              >
                <option value="boy">男孩</option>
                <option value="girl">女孩</option>
              </select>
            </Field>
            <Field label="星座">
              <input 
                value={profile.zodiac} 
                onChange={(e) => handleChange('zodiac', e.target.value)}
                className="w-full text-right outline-none bg-transparent" 
                placeholder="输入星座"
              />
            </Field>
            <Field label="MBTI">
              <input 
                value={profile.mbti} 
                onChange={(e) => handleChange('mbti', e.target.value)}
                className="w-full text-right outline-none bg-transparent"
                placeholder="输入MBTI" 
              />
            </Field>
          </div>
        </Card>

        <Card title={<><Icons.Paw className="w-5 h-5 text-neko-pink"/> 家庭 & 性格</>}>
          <div className="space-y-4">
             <Field label="爸爸 (昵称)">
              <input 
                value={profile.father || ''} 
                onChange={(e) => handleChange('father', e.target.value)}
                className="w-full text-right outline-none bg-transparent" 
                placeholder="铲屎官A (选填)"
              />
            </Field>
             <Field label="妈妈 (昵称)">
              <input 
                value={profile.mother || ''} 
                onChange={(e) => handleChange('mother', e.target.value)}
                className="w-full text-right outline-none bg-transparent" 
                placeholder="铲屎官B (选填)"
              />
            </Field>
            <div className="mt-2">
              <label className="text-sm text-gray-500 font-bold">性格描述</label>
              <textarea 
                value={profile.personality}
                onChange={(e) => handleChange('personality', e.target.value)}
                className="w-full mt-1 p-2 rounded-xl bg-neko-cream border-none outline-none resize-none text-gray-700 h-24"
                placeholder="这只猫咪性格怎么样？"
              />
            </div>
          </div>
        </Card>
      </div>
      
      <div className="flex justify-center">
         <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? '完成名字编辑' : '修改名字'}
         </Button>
      </div>
    </div>
  );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0 last:pb-0">
    <span className="text-gray-500 font-medium whitespace-nowrap">{label}</span>
    <div className="flex-1 text-right text-gray-700 font-medium ml-4">
      {children}
    </div>
  </div>
);