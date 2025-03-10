export const CartVisualizer = () => {
    const items = [
      { label: "Rent", value: 70 },
      { label: "Insurance", value: 15 },
      { label: "Services", value: 10 },
      { label: "Taxes", value: 5 }
    ];
  
    return (
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="w-24 text-sm">{item.label}</div>
            <div className="flex-1 relative h-4 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-primary/80 rounded-full"
                style={{ width: `${item.value}%` }}
              ></div>
            </div>
            <div className="w-12 text-right text-sm">{item.value}%</div>
          </div>
        ))}
      </div>
    );
  };