export const products = Array.from({ length: 30 }, (_, i) => ({
    // 👉 ID diubah menjadi angka murni agar sinkron dengan API DummyJSON
    id: i + 1, 
    // Properti baru untuk mempertahankan format ID lama kamu di UI tabel
    customId: `PRD-${1000 + i}`, 
    title: [
        "Nasi Goreng Spesial",
        "Mie Ayam Kuning",
        "Soto Ayam",
        "Gado-Gado",
        "Lumpia Goreng",
        "Perkedel Goreng",
        "Tahu Goreng",
        "Telur Ceplok",
        "Bakso Sapi",
        "Martabak Manis",
        "Martabak Telur",
        "Krupuk Goreng",
        "Nasi Kuning",
        "Chicken Satay",
        "Spring Roll",
        "Dim Sum",
        "Fried Rice",
        "Stir Fry Vegetable",
        "Grilled Fish",
        "Shrimp Tempura",
        "Beef Rendang",
        "Chicken Curry",
        "Fish Soup",
        "Vegetable Soup",
        "Fried Noodle",
        "Steamed Rice",
        "Grilled Chicken",
        "Seafood Fried Rice",
        "Crispy Duck",
        "Roasted Pork"
    ][i % 30],
    code: `SKU-${String(i + 1).padStart(4, "0")}`,
    category: ["Makanan", "Minuman", "Dessert", "Snack"][i % 4],
    brand: [
        "Sedap Kitchen",
        "Fresh Meals",
        "Boga Kitchen",
        "Chef's Choice",
        "Homemade Delight"
    ][i % 5],
    price: 15000 + (i * 1000) + (i % 3) * 5000,
    stock: Math.floor(Math.random() * 100) + 5
}));