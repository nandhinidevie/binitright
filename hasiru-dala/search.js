const wasteDatabase = {
      "Vegetable/fruit peels": "Wet Waste",
      "Cooked food/leftovers": "Wet Waste",
      "Eggshells": "Wet Waste",
      "Chicken/fish bones": "Wet Waste",
      "Rotten fruits/vegetables": "Wet Waste",
      "Tissue paper soiled with food": "Wet Waste",
      "Coffee grinds, Tea Leaves": "Wet Waste",
      "Leaf plates": "Wet Waste",
      "Fallen Leaves/twigs": "Wet Waste",
      "medicine": "Wet Waste",
      "Puja Flowers/garlands": "Wet Waste",
      "Weeds": "Wet Waste",
      "Plastic covers/bottles/boxes": "Dry Waste",
      "Chips/toffee wrappers": "Dry Waste",
      "Plastic cups": "Dry Waste",
      "Milk/Curd packets": "Dry Waste",
      "Foil containers": "Dry Waste",
      "Metal cans": "Dry Waste",
      "Unbroken glass bottles": "Dry Waste",
      "Newspaper/magazine": "Dry Waste",
      "Stationary/junk mail": "Dry Waste",
      "Cardboard cartons": "Dry Waste",
      "Pizza boxes": "Dry Waste",
      "Tetra packs": "Dry Waste",
      "Paper cups and plates": "Dry Waste",
      "Rubber/thermocol": "Dry Waste",
      "Old mop/duster/sponge": "Dry Waste",
      "Cosmetics": "Dry Waste",
      "Ceramic, Wooden chips": "Dry Waste",
      "Hair": "Dry Waste",
      "Coconut shells": "Dry Waste",
      "Batteries, Cellphones": "Dry Waste",
      "Laptops, Keyboards": "Dry Waste",
      "Home Appliances": "Dry Waste",
      "Bulbs/tube lights/CFLs": "Dry Waste",
      "Diapers/sanitary napkins": "Reject Waste",
      "Bandages, Gloves, Masks": "Reject Waste",
      "Condoms": "Reject Waste",
      "Nails": "Reject Waste",
      "Used tissues": "Reject Waste",
      "Medicines": "Reject Waste",
      "Razors/blades": "Reject Waste",
      "Used syringes": "Reject Waste",
      "Injection vials": "Reject Waste",
      "Swept dust": "Reject Waste",
      "Rubble": "Reject Waste",
      "Paints": "Reject Waste",
      "Silt from drains": "Reject Waste",
      "Cement powder": "Reject Waste",
      "Bricks": "Reject Waste",
      "Broken flower pots": "Reject Waste",
      "Broken glass": "Reject Waste",
    };

    const input = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const results = document.getElementById('results');

    function showResult(text, colorClass, icon) {
      const el = document.createElement('div');
      el.className = `result ${colorClass}`;
      el.innerHTML = `<span class="icon">${icon}</span><span>${text}</span>`;
      results.appendChild(el);
    }

    function clearResults() {
      results.innerHTML = '';
    }

    function checkBin() {
      clearResults();
      const q = input.value.trim().toLowerCase(); // case-insensitive
      if (!q) {
        showResult('⚠️ Please enter an item to search.', 'orange', 'ℹ️');
        return;
      }

      const matches = Object.keys(wasteDatabase).filter(k =>
        k.toLowerCase().includes(q) // case-insensitive match
      );

      if (matches.length === 0) {
        showResult('❌ Item not found in database. Please dispose responsibly!', 'orange', '⚠️');
        return;
      }

      matches.forEach(k => {
        const bin = wasteDatabase[k];
        if (bin.includes('Wet')) showResult(`"${k}" → ${bin}`, 'green');
        else if (bin.includes('Dry')) showResult(`"${k}" → ${bin}`, 'blue');
        else showResult(`"${k}" → ${bin}`, 'red');
      });
    }

    searchBtn.addEventListener('click', checkBin);

    input.addEventListener('keydown', e => { if (e.key === 'Enter') checkBin(); });
