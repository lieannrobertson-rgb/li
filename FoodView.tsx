import React, { useState } from 'react';
import { FoodItem } from '../../types';
import { storage } from '../../utils';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Icons } from '../../constants';

export const FoodView: React.FC = () => {
  const [inventory, setInventory] = useState<FoodItem[]>(storage.getFood());
  
  const handleUpdate = (id: string, field: keyof FoodItem, value: any) => {
    const updated = inventory.map(item => item.id === id ? { ...item, [field]: value } : item);
    setInventory(updated);
    storage.setFood(updated);
  };

  const handleAdd = (type: 'staple' | 'snack') => {
    const newItem: FoodItem = {
      id: Date.now().toString(),
      brand: '新品牌',
      quantity: 1,
      type,
      category: type === 'snack' ? '罐头' : undefined
    };
    const updated = [...inventory, newItem];
    setInventory(updated);
    storage.setFood(updated);
  };

  const handleDelete = (id: string) => {
    if(confirm('吃光了吗？确定删除？')) {
      const updated = inventory.filter(i => i.id !== id);
      setInventory(updated);
      storage.setFood(updated);
    }
  };

  const renderItem = (item: FoodItem) => (
    <div key={item.id} className="flex items-center justify-between p-3 bg-neko-cream rounded-xl mb-3">
      <div className="flex-1">
        <input 
          className="bg-transparent font-bold text-gray-700 outline-none w-full mb-1"
          value={item.brand}
          onChange={(e) => handleUpdate(item.id, 'brand', e.target.value)}
        />
        <div className="flex items-center gap-2 text-xs text-gray-500">
           {item.type === 'snack' && (
             <select 
              value={item.category} 
              onChange={(e) => handleUpdate(item.id, 'category', e.target.value)}
              className="bg-white rounded px-1 outline-none"
             >
               <option>罐头</option>
               <option>冻干</option>
               <option>猫条</option>
               <option>其他</option>
             </select>
           )}
           {item.type === 'staple' ? '库存(g)' : '剩余(个)'}
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <button 
          onClick={() => handleUpdate(item.id, 'quantity', Math.max(0, item.quantity - (item.type === 'staple' ? 100 : 1)))}
          className="w-8 h-8 rounded-full bg-white text-neko-orange font-bold shadow-sm hover:bg-gray-50"
        >-</button>
        <input 
            type="number"
            className="w-16 text-center bg-transparent font-bold text-lg text-gray-800 outline-none"
            value={item.quantity}
            onChange={(e) => handleUpdate(item.id, 'quantity', parseInt(e.target.value) || 0)}
        />
        <button 
          onClick={() => handleUpdate(item.id, 'quantity', item.quantity + (item.type === 'staple' ? 100 : 1))}
          className="w-8 h-8 rounded-full bg-white text-neko-orange font-bold shadow-sm hover:bg-gray-50"
        >+</button>
        
        <button onClick={() => handleDelete(item.id)} className="ml-2 text-gray-300 hover:text-neko-pink">
          <Icons.Trash />
        </button>
      </div>
    </div>
  );

  const staples = inventory.filter(i => i.type === 'staple');
  const snacks = inventory.filter(i => i.type === 'snack');

  return (
    <div className="pb-20 space-y-6">
      <Card title="粮仓 (主食)">
        {staples.map(renderItem)}
        <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => handleAdd('staple')}>
           <Icons.Plus /> 添加主食
        </Button>
      </Card>

      <Card title="零食柜">
        {snacks.map(renderItem)}
        <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => handleAdd('snack')}>
           <Icons.Plus /> 添加零食
        </Button>
      </Card>
    </div>
  );
};