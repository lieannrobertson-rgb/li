import React, { useState } from 'react';
import { GrowthRecord } from '../../types';
import { storage, compressImage } from '../../utils';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Icons } from '../../constants';

export const GrowthView: React.FC = () => {
  const [records, setRecords] = useState<GrowthRecord[]>(storage.getGrowth());
  const [showAdd, setShowAdd] = useState(false);
  
  // New record state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newImg, setNewImg] = useState('');

  const handleSave = () => {
    if (!newTitle) return;
    const newRecord: GrowthRecord = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDesc,
      date: newDate,
      image: newImg
    };
    const updated = [newRecord, ...records];
    setRecords(updated);
    storage.setGrowth(updated);
    
    // Reset
    setShowAdd(false);
    setNewTitle('');
    setNewDesc('');
    setNewImg('');
  };

  const handleDelete = (id: string) => {
    if (confirm('确认删除这条回忆吗？')) {
      const updated = records.filter(r => r.id !== id);
      setRecords(updated);
      storage.setGrowth(updated);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await compressImage(file);
        setNewImg(base64);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="pb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-700">成长记事本</h2>
        <Button onClick={() => setShowAdd(!showAdd)} variant="primary">
          <Icons.Plus /> 记一笔
        </Button>
      </div>

      {showAdd && (
        <Card className="mb-6 border-neko-orange border-2 animate-fade-in">
          <div className="space-y-3">
             <input 
               type="text" 
               placeholder="标题 (e.g. 学会握手啦)" 
               className="w-full p-2 bg-neko-cream rounded-lg outline-none font-bold text-gray-700"
               value={newTitle}
               onChange={e => setNewTitle(e.target.value)}
             />
             <input 
               type="date" 
               className="w-full p-2 bg-neko-cream rounded-lg outline-none text-gray-500"
               value={newDate}
               onChange={e => setNewDate(e.target.value)}
             />
             <textarea 
               placeholder="发生了什么有趣的事？"
               className="w-full p-2 bg-neko-cream rounded-lg outline-none resize-none h-20 text-gray-600"
               value={newDesc}
               onChange={e => setNewDesc(e.target.value)}
             />
             
             {/* Photo Upload Area - Enhanced */}
             <div className="relative group rounded-xl overflow-hidden border-2 border-dashed border-neko-blue/50 bg-neko-cream/30 min-h-[160px] flex flex-col items-center justify-center">
                {newImg ? (
                  <>
                    <img src={newImg} alt="Preview" className="w-full h-full object-contain max-h-[300px]" />
                    <button onClick={() => setNewImg('')} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs">✕</button>
                  </>
                ) : (
                  <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center py-6 text-neko-blue hover:bg-neko-blue/5 transition-colors">
                      <Icons.Paw className="w-8 h-8 mb-2 opacity-50" />
                      <span className="text-sm font-bold">点击添加一张萌照 (可选)</span>
                      <span className="text-xs text-gray-400 mt-1">留住美好瞬间</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
             </div>

             <Button onClick={handleSave} className="w-full mt-2">保存回忆</Button>
          </div>
        </Card>
      )}

      <div className="space-y-4 masonry-grid">
        {records.map(record => (
          <div key={record.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            {record.image ? (
              <div className="relative">
                 <img src={record.image} alt={record.title} className="w-full max-h-80 object-cover" />
                 <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                     <h3 className="font-bold text-lg text-white drop-shadow-sm">{record.title}</h3>
                 </div>
              </div>
            ) : (
              <div className="p-4 pb-0">
                  <h3 className="font-bold text-lg text-gray-800">{record.title}</h3>
              </div>
            )}
            
            <div className="p-4 pt-2">
              <div className="flex justify-between items-start mb-2">
                 <p className="text-xs text-neko-pink font-bold bg-neko-cream px-2 py-1 rounded-full">{record.date}</p>
                 <button onClick={() => handleDelete(record.id)} className="text-gray-300 hover:text-red-400">
                    <Icons.Trash />
                 </button>
              </div>
              {record.description && (
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{record.description}</p>
              )}
            </div>
          </div>
        ))}

        {records.length === 0 && (
          <div className="text-center py-10 text-gray-400">
             <Icons.Paw className="w-12 h-12 mx-auto mb-2 opacity-30" />
             <p>还没有记录哦，快来记下第一笔吧！</p>
          </div>
        )}
      </div>
    </div>
  );
};