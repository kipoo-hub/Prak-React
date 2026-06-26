import { supabase } from "../lib/supabase";

// =========================================
// PRODUCTS
// =========================================
export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getProductById(id) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function createProduct(product) {
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProduct(id, updates) {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProduct(id) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

// =========================================
// CUSTOMERS
// =========================================
export async function getCustomers() {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createCustomer(customer) {
  const { data, error } = await supabase
    .from("customers")
    .insert(customer)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCustomer(id, updates) {
  const { data, error } = await supabase
    .from("customers")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCustomer(id) {
  const { error } = await supabase.from("customers").delete().eq("id", id);
  if (error) throw error;
}

// =========================================
// ORDERS
// =========================================
export async function getOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*, customers(name, email, profile_id)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getOrderById(id) {
  const { data, error } = await supabase
    .from("orders")
    .select("*, customers(*), order_items(*, products(*))")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function createOrder(order) {
  const { data, error } = await supabase
    .from("orders")
    .insert(order)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateOrderStatus(id, status) {
  const { data, error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// =========================================
// ORDER ITEMS
// =========================================
export async function createOrderItems(items) {
  const { data, error } = await supabase
    .from("order_items")
    .insert(items)
    .select();
  if (error) throw error;
  return data;
}

export async function getOrderItems(orderId) {
  const { data, error } = await supabase
    .from("order_items")
    .select("*, products(*)")
    .eq("order_id", orderId);
  if (error) throw error;
  return data;
}

// =========================================
// POINT TRANSACTIONS
// =========================================
export async function awardPoints(profileId, orderId, totalAmount) {
  const pointsEarned = Math.floor(totalAmount / 10000); // 1 poin per Rp 10.000
  if (pointsEarned <= 0) return null;

  const { data, error } = await supabase
    .from("point_transactions")
    .insert({
      profile_id: profileId,
      order_id: orderId,
      points: pointsEarned,
      type: "earn",
      description: `Points earned from order`,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// =========================================
// MEMBER TIERS
// =========================================
export async function getTiers() {
  const { data, error } = await supabase
    .from("member_tiers")
    .select("*")
    .order("min_points", { ascending: true });
  if (error) throw error;
  return data;
}

export async function createTier(tier) {
  const { data, error } = await supabase
    .from("member_tiers")
    .insert(tier)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTier(id, updates) {
  const { data, error } = await supabase
    .from("member_tiers")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTier(id) {
  const { error } = await supabase.from("member_tiers").delete().eq("id", id);
  if (error) throw error;
}

// =========================================
// USERS / PROFILES (Admin only)
// =========================================
export async function getUsers() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*, member_tiers(name)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function updateUserRole(id, role) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ role, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// =========================================
// DASHBOARD STATS
// =========================================
export async function getDashboardStats() {
  // Wrap each query so one failure doesn't crash the whole dashboard
  let ordersData = [];
  let customerCount = 0;
  let productCount = 0;

  try {
    const { data } = await supabase
      .from("orders")
      .select("id, total_amount, status, created_at");
    ordersData = data || [];
  } catch (e) { console.warn("Failed to fetch orders for stats:", e.message); }

  try {
    const { count } = await supabase
      .from("customers")
      .select("*", { count: "exact", head: true });
    customerCount = count || 0;
  } catch (e) { console.warn("Failed to fetch customer count:", e.message); }

  try {
    const { count } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });
    productCount = count || 0;
  } catch (e) { console.warn("Failed to fetch product count:", e.message); }

  const nonCancelled = ordersData.filter((o) => o.status !== "cancelled");
  const totalRevenue = nonCancelled.reduce((sum, o) => sum + Number(o.total_amount), 0);
  const orderCount = ordersData.length;

  // Group revenue by date for chart
  const revenueByDate = {};
  nonCancelled.forEach((o) => {
    const date = new Date(o.created_at).toISOString().split("T")[0];
    revenueByDate[date] = (revenueByDate[date] || 0) + Number(o.total_amount);
  });

  const revenueChartData = Object.entries(revenueByDate)
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Jika tidak ada data real, gunakan sample data agar chart tetap terlihat
  if (revenueChartData.length === 0) {
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      revenueChartData.push({ date: dateStr, revenue: 0 });
    }
  }

  return {
    orderCount,
    totalRevenue,
    customerCount,
    productCount,
    revenueByDate: revenueChartData,
  };
}

export async function getMemberDashboardStats(profileId) {
  const { data: ordersData, error: ordersError } = await supabase
    .from("orders")
    .select("id, total_amount, status, created_at")
    .in("customer_id", (
      await supabase.from("customers").select("id").eq("profile_id", profileId)
    ).data?.map((c) => c.id) || []);
  if (ordersError) throw ordersError;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, member_tiers(*)")
    .eq("id", profileId)
    .single();

  const { data: allTiers } = await supabase
    .from("member_tiers")
    .select("*")
    .order("min_points", { ascending: true });

  // Calculate next tier
  const currentTierIndex = allTiers?.findIndex((t) => t.id === profile?.tier_id) || 0;
  const nextTier = allTiers?.[currentTierIndex + 1] || null;

  return {
    totalPoints: profile?.total_points || 0,
    currentTier: profile?.member_tiers || null,
    nextTier,
    orderCount: ordersData.length,
    lastOrder: ordersData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0] || null,
  };
}
