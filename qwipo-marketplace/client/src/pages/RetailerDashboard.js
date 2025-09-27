import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BarChart3, Package, TrendingUp, ShoppingCart, AlertTriangle, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { productsAPI, recommendationsAPI } from '../services/api';

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem;
`;

const StatRow = styled.div`
  display: flex;
  align-items: center;
  gap: .75rem;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
`;

const StatLabel = styled.div`
  color: #6b7280;
  font-size: .875rem;
`;

const Chart = styled.div`
  margin-top: .75rem;
  height: 120px;
  display: flex;
  align-items: flex-end;
  gap: 6px;
`;

const Bar = styled.div`
  width: 10%;
  background: linear-gradient(180deg, #60a5fa, #3b82f6);
  border-radius: 6px 6px 0 0;
`;

export default function RetailerDashboard() {
  const { user } = useAuth();
  const { on, off } = useSocket();
  const [weeklyOrders] = useState([5, 8, 6, 10, 12, 9, 7]);
  const [lowStock] = useState(4);
  const [reminders, setReminders] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [seasonal, setSeasonal] = useState([]);
  const [nearby, setNearby] = useState([]);

  const fetchReminders = async () => {
    const resp = await recommendationsAPI.getReminders();
    setReminders(resp?.data?.data?.reminders || []);
  };
  const fetchBundles = async () => {
    const resp = await recommendationsAPI.getBundles();
    setBundles(resp?.data?.data?.bundles || []);
  };
  const fetchSeasonal = async () => {
    const resp = await recommendationsAPI.getSeasonal();
    setSeasonal(resp?.data?.data?.products || []);
  };
  const fetchNearby = async () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const resp = await productsAPI.getByLocation({ lat: latitude, lng: longitude, limit: 8 });
      setNearby(resp?.data?.data?.products || []);
    });
  };

  useEffect(() => {
    fetchReminders();
    fetchBundles();
    fetchSeasonal();
    fetchNearby();
  }, []);

  useEffect(() => {
    const handleRecs = () => {
      fetchReminders();
      fetchBundles();
    };
    const handleSeasonal = () => {
      fetchSeasonal();
    };
    on('recommendations_update', handleRecs);
    on('seasonal_push', handleSeasonal);
    return () => {
      off('recommendations_update', handleRecs);
      off('seasonal_push', handleSeasonal);
    };
  }, [on, off]);

  return (
    <Container>
      <Header>
        <Title>Retailer Dashboard</Title>
      </Header>

      <Grid>
        <Card>
          <StatRow>
            <ShoppingCart size={24} color="#3b82f6" />
            <div>
              <StatValue>128</StatValue>
              <StatLabel>Orders This Month</StatLabel>
            </div>
          </StatRow>
          <Chart>
            {weeklyOrders.map((v, i) => (
              <Bar key={i} style={{ height: `${v * 8}px` }} />
            ))}
          </Chart>
        </Card>

        <Card>
          <StatRow>
            <TrendingUp size={24} color="#10b981" />
            <div>
              <StatValue>₹ 3.2L</StatValue>
              <StatLabel>Spend This Month</StatLabel>
            </div>
          </StatRow>
          <div style={{ marginTop: 10, color: '#6b7280', fontSize: 14 }}>
            Avg. order value: ₹ 2,540
          </div>
        </Card>

        <Card>
          <StatRow>
            <Package size={24} color="#f59e0b" />
            <div>
              <StatValue>56</StatValue>
              <StatLabel>Saved Products</StatLabel>
            </div>
          </StatRow>
          <div style={{ marginTop: 10, color: '#6b7280', fontSize: 14 }}>
            12 new deals nearby
          </div>
        </Card>

        <Card>
          <StatRow>
            <AlertTriangle size={24} color="#ef4444" />
            <div>
              <StatValue>{lowStock}</StatValue>
              <StatLabel>Low-stock Alerts</StatLabel>
            </div>
          </StatRow>
          <div style={{ marginTop: 10, color: '#6b7280', fontSize: 14 }}>
            Restock recommended products
          </div>
        </Card>
      </Grid>

      <Card style={{ marginTop: '1rem' }}>
        <StatRow style={{ marginBottom: 12 }}>
          <BarChart3 size={22} color="#111827" />
          <div style={{ fontWeight: 600, color: '#111827' }}>Top Categories</div>
        </StatRow>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { label: 'Grocery', value: 42 },
            { label: 'Beverages', value: 28 },
            { label: 'Personal Care', value: 17 },
          ].map((c) => (
            <div key={c.label}>
              <div style={{ color: '#374151', fontSize: 14 }}>{c.label}</div>
              <div style={{ height: 8, background: '#e5e7eb', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: `${c.value}%`, height: '100%', background: '#3b82f6' }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Realtime: Reorder Reminders */}
      <Card style={{ marginTop: '1rem' }}>
        <StatRow style={{ marginBottom: 12 }}>
          <AlertTriangle size={20} color="#ef4444" />
          <div style={{ fontWeight: 600, color: '#111827' }}>Reorder Reminders</div>
        </StatRow>
        {reminders.length === 0 ? (
          <div style={{ color: '#6b7280' }}>No reminders yet.</div>
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            {reminders.map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#111827' }}>{r.product?.name}</div>
                  <div style={{ color: '#6b7280', fontSize: 13 }}>{r.reason}</div>
                </div>
                <div style={{ color: '#2563eb', fontWeight: 600 }}>{r.dueInDays} days</div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Realtime: Personalized Bundles */}
      <Card style={{ marginTop: '1rem' }}>
        <StatRow style={{ marginBottom: 12 }}>
          <TrendingUp size={20} color="#10b981" />
          <div style={{ fontWeight: 600, color: '#111827' }}>Personalized Bundles</div>
        </StatRow>
        {bundles.length === 0 ? (
          <div style={{ color: '#6b7280' }}>No bundle suggestions yet.</div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {bundles.map((b) => (
              <div key={b.id}>
                <div style={{ fontWeight: 600, color: '#111827' }}>{b.name}</div>
                <div style={{ color: '#6b7280', fontSize: 13 }}>{b.description}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                  {(b.products || []).map((p) => (
                    <span key={p._id} style={{ fontSize: 12, background: '#eff6ff', padding: '4px 8px', borderRadius: 999, color: '#1d4ed8' }}>{p.name}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Realtime: Seasonal Picks */}
      <Card style={{ marginTop: '1rem' }}>
        <StatRow style={{ marginBottom: 12 }}>
          <Package size={20} color="#f59e0b" />
          <div style={{ fontWeight: 600, color: '#111827' }}>Seasonal Picks</div>
        </StatRow>
        {seasonal.length === 0 ? (
          <div style={{ color: '#6b7280' }}>No seasonal products at the moment.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {seasonal.map((p) => (
              <div key={p._id} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 10 }}>
                <div style={{ fontWeight: 600, color: '#111827' }}>{p.name}</div>
                <div style={{ color: '#6b7280', fontSize: 13 }}>{p.brand}</div>
                <div style={{ color: '#10b981', fontWeight: 600 }}>₹ {p.pricing?.sellingPrice}</div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Realtime: Nearby Deals */}
      <Card style={{ marginTop: '1rem' }}>
        <StatRow style={{ marginBottom: 12 }}>
          <MapPin size={20} color="#2563eb" />
          <div style={{ fontWeight: 600, color: '#111827' }}>Nearby Deals</div>
        </StatRow>
        {nearby.length === 0 ? (
          <div style={{ color: '#6b7280' }}>Detecting your location or no nearby offers.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {nearby.map((p) => (
              <div key={p._id} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 10 }}>
                <div style={{ fontWeight: 600, color: '#111827' }}>{p.name}</div>
                <div style={{ color: '#6b7280', fontSize: 13 }}>{p.brand}</div>
                <div style={{ color: '#10b981', fontWeight: 600 }}>₹ {p.pricing?.sellingPrice}</div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </Container>
  );
}
