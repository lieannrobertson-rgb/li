import React, { useState, useEffect } from 'react';
import { HealthState, MedicalRecord, WeightRecord } from '../../types';
import { storage, addDays, getDaysDiff } from '../../utils';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Icons } from '../../constants';

export const HealthView: React.FC = () => {
  const [health, setHealth] = useState<HealthState>(storage.getHealth());
  const [isLitterSettingsOpen, setIsLitterSettingsOpen] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  // Auto-reset water check-in daily
  useEffect(() => {
    if (health.waterCheckIn.lastDate !== today) {
      setHealth(prev => ({ ...prev, waterCheckIn: { lastDate: today, done: false } }));
    }
  }, [today]);

  const updateHealth = (newState: HealthState) => {
    setHealth(newState);
    storage.setHealth(newState);
  };

  // Water
  const toggleWater = () => {
    updateHealth({
      ...health,
      waterCheckIn: { lastDate: today, done: !health.waterCheckIn.done }
    });
  };

  // Litter
  const changeLitter = () => {
    updateHealth({
      ...health,
      litter: { ...health.litter, lastChanged: today }
    });
  };
  
  const updateLitterSettings = (field: 'cycleDays' | 'type', value: any) => {
    updateHealth({
      ...health,
      litter: { ...health.litter, [field]: value }
    });
  };

  const litterDueDays = health.litter.cycleDays - getDaysDiff(health.litter.lastChanged);
  const litterType = health.litter.type || '豆腐砂'; // Default for old data

  // Vaccines & Deworm
  const vaccineNext = addDays(health.vaccine.lastDate, 365);
  const dewormNext = addDays(health.deworm.lastDate, 90);

  // Weight
  const [newWeight, setNewWeight] = useState('');
  const addWeight = () => {
    if (!newWeight) return;
    const record: WeightRecord = { id: Date.now().toString(), date: today, weight: parseFloat(newWeight) };
    updateHealth({
      ...health,
      weightHistory: [record, ...health.weightHistory]
    });
    setNewWeight('');
  };

  // Medical
  const [showMedForm, setShowMedForm] = useState(false);
  const [medForm, setMedForm] = useState({ condition: '', medication: '', notes: '' });
  const addMedical = () => {
    const record: MedicalRecord = { ...medForm, id: Date.now().toString(), date: today };
    updateHealth({
      ...health,
      medicalHistory: [record, ...health.medicalHistory]
    });
    setShowMedForm(false);
    setMedForm({ condition: '', medication: '', notes: '' });
  };

  return (
    <div className="pb-20 space-y-6">
      {/* Daily Tasks */}
      <Card title="今日打卡">
        <div 
          onClick={toggleWater}
          className={`cursor-pointer rounded-xl p-4 flex justify-between items-center transition-all ${health.waterCheckIn.done ? 'bg-neko-blue text-white' : 'bg-gray-100 text-gray-500'}`}
        >
           <div className="flex items-center gap-3">
             <div className="text-2xl">💧</div>
             <div className="font-bold">正常喝水</div>
           </div>
           <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${health.waterCheckIn.done ? 'border-white bg-white text-neko-blue' : 'border-gray-400'}`}>
             {health.waterCheckIn.done && '✓'}
           </div>
        </div>
      </Card>

      {/* Litter */}
      <Card>
         <div className="flex justify-between items-start mb-4">
             <div className="font-bold text-lg text-gray-700 flex items-center gap-2">猫砂盆</div>
             <button onClick={() => setIsLitterSettingsOpen(!isLitterSettingsOpen)} className="text-gray-400 hover:text-neko-orange">
                <Icons.Settings />
             </button>
         </div>

         {isLitterSettingsOpen && (
           <div className="bg-neko-cream p-3 rounded-xl mb-4 text-sm space-y-2 animate-fade-in">
             <div className="flex justify-between items-center">
               <span className="text-gray-600">猫砂类型:</span>
               <select 
                 value={litterType}
                 onChange={(e) => updateLitterSettings('type', e.target.value)}
                 className="bg-white rounded px-2 py-1 outline-none text-gray-700"
               >
                 <option value="豆腐砂">豆腐砂</option>
                 <option value="膨润土">膨润土</option>
                 <option value="混合砂">混合砂</option>
                 <option value="水晶砂">水晶砂</option>
                 <option value="松木砂">松木砂</option>
               </select>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-gray-600">更换周期 (天):</span>
               <input 
                 type="number"
                 className="w-16 text-center bg-white rounded px-1 py-1 outline-none"
                 value={health.litter.cycleDays}
                 onChange={(e) => updateLitterSettings('cycleDays', parseInt(e.target.value) || 7)}
               />
             </div>
           </div>
         )}

         <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-gray-500 text-sm">上次更换: {health.litter.lastChanged}</p>
              <div className="flex items-center gap-2">
                 <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-500">{litterType}</span>
                 <span className="text-gray-400 text-xs">周期: {health.litter.cycleDays}天</span>
              </div>
            </div>
            <div className="text-right">
               <span className={`text-2xl font-bold ${litterDueDays < 3 ? 'text-red-500' : 'text-neko-orange'}`}>
                 {litterDueDays}
               </span>
               <span className="text-xs text-gray-400 block">天后更换</span>
            </div>
         </div>
         <Button onClick={changeLitter} className="w-full bg-neko-cream text-neko-orange hover:bg-orange-100">
           今天铲了/换了！
         </Button>
      </Card>

      {/* Routine Care */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="text-center">
           <h3 className="font-bold text-gray-700 mb-2">下次疫苗</h3>
           <p className="text-neko-pink font-bold text-lg">{vaccineNext}</p>
           <input 
             type="date" 
             className="mt-2 text-xs text-gray-400 outline-none w-full text-center"
             value={health.vaccine.lastDate}
             onChange={(e) => updateHealth({...health, vaccine: {lastDate: e.target.value}})}
           />
        </Card>
        <Card className="text-center">
           <h3 className="font-bold text-gray-700 mb-2">下次驱虫</h3>
           <p className="text-neko-blue font-bold text-lg">{dewormNext}</p>
           <input 
             type="date" 
             className="mt-2 text-xs text-gray-400 outline-none w-full text-center"
             value={health.deworm.lastDate}
             onChange={(e) => updateHealth({...health, deworm: {lastDate: e.target.value}})}
           />
        </Card>
      </div>

      {/* Weight */}
      <Card title="体重记录 (KG)">
        <div className="flex gap-2 mb-4">
          <input 
            type="number" 
            placeholder="0.0" 
            step="0.1"
            className="flex-1 p-2 bg-neko-cream rounded-xl outline-none"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
          />
          <Button onClick={addWeight} size="sm">记录</Button>
        </div>
        <div className="max-h-40 overflow-y-auto space-y-2">
          {health.weightHistory.map(w => (
            <div key={w.id} className="flex justify-between border-b border-gray-100 pb-1 text-sm text-gray-600">
              <span>{w.date}</span>
              <span className="font-bold">{w.weight} kg</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Medical */}
      <Card title="就医小本本">
        <Button variant="outline" size="sm" className="w-full mb-3" onClick={() => setShowMedForm(!showMedForm)}>
          {showMedForm ? '取消' : '添加病历'}
        </Button>
        
        {showMedForm && (
          <div className="bg-neko-cream p-3 rounded-xl mb-4 space-y-2">
            <input 
              placeholder="症状/病名" 
              className="w-full p-2 rounded-lg outline-none" 
              value={medForm.condition} 
              onChange={e => setMedForm({...medForm, condition: e.target.value})}
            />
            <input 
              placeholder="用药记录" 
              className="w-full p-2 rounded-lg outline-none"
              value={medForm.medication} 
              onChange={e => setMedForm({...medForm, medication: e.target.value})}
            />
            <input 
              placeholder="备注" 
              className="w-full p-2 rounded-lg outline-none"
              value={medForm.notes} 
              onChange={e => setMedForm({...medForm, notes: e.target.value})}
            />
            <Button onClick={addMedical} className="w-full">保存病历</Button>
          </div>
        )}

        <div className="space-y-3">
          {health.medicalHistory.length === 0 && <p className="text-gray-400 text-center text-sm">身体棒棒，暂无病历！</p>}
          {health.medicalHistory.map(m => (
            <div key={m.id} className="bg-red-50 p-3 rounded-xl border border-red-100">
               <div className="flex justify-between font-bold text-red-400 text-sm">
                 <span>{m.condition}</span>
                 <span>{m.date}</span>
               </div>
               <p className="text-xs text-gray-600 mt-1">药: {m.medication}</p>
               {m.notes && <p className="text-xs text-gray-500 mt-1 italic">{m.notes}</p>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};