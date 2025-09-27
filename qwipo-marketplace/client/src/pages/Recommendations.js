import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Star, TrendingUp, Gift, Sparkles, RefreshCw } from 'lucide-react';
import styled from 'styled-components';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { recommendationsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const RecommendationsContainer = styled.div`
  min-height: calc(100vh - 4rem);
  background: #f8fafc;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ContentSection = styled.section`
  padding: 4rem 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #2563eb;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: white;
  padding: 0.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const Tab = styled.button`
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  background: ${props => props.active ? '#3b82f6' : 'transparent'};
  color: ${props => props.active ? 'white' : '#6b7280'};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover:not(.active) {
    background: #f1f5f9;
    color: #374151;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const BundleSection = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const BundleHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const BundleIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border-radius: 0.75rem;
`;

const BundleTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const BundleDescription = styled.p`
  color: #64748b;
  margin-bottom: 1.5rem;
`;

const BundleProducts = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const BundleProduct = styled.div`
  background: #f8fafc;
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

const BundleProductName = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1e293b;
`;

const BundleProductPrice = styled.div`
  font-size: 0.875rem;
  color: #3b82f6;
  font-weight: 500;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const EmptyStateIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  background: #f1f5f9;
  color: #6b7280;
  border-radius: 1rem;
  margin-bottom: 1rem;
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1e293b;
`;

const EmptyStateText = styled.p`
  color: #6b7280;
  margin-bottom: 1.5rem;
`;

const GenerateButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #2563eb;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const Recommendations = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personalized');
  const [wishlist, setWishlist] = useState(new Set());

  // Fetch personalized recommendations
  const { 
    data: personalizedData, 
    isLoading: personalizedLoading,
    refetch: refetchPersonalized 
  } = useQuery(
    'personalized-recommendations',
    () => recommendationsAPI.getPersonalized(),
    {
      enabled: !!user && activeTab === 'personalized',
      staleTime: 5 * 60 * 1000,
    }
  );

  // Fetch seasonal recommendations
  const { 
    data: seasonalData, 
    isLoading: seasonalLoading 
  } = useQuery(
    'seasonal-recommendations',
    () => recommendationsAPI.getSeasonal(),
    {
      enabled: activeTab === 'seasonal',
      staleTime: 10 * 60 * 1000,
    }
  );

  // Fetch trending recommendations
  const { 
    data: trendingData, 
    isLoading: trendingLoading 
  } = useQuery(
    'trending-recommendations',
    () => recommendationsAPI.getTrending(),
    {
      enabled: activeTab === 'trending',
      staleTime: 5 * 60 * 1000,
    }
  );

  // Fetch bundles
  const { 
    data: bundlesData, 
    isLoading: bundlesLoading 
  } = useQuery(
    'bundles',
    () => recommendationsAPI.getBundles(),
    {
      enabled: activeTab === 'bundles',
      staleTime: 10 * 60 * 1000,
    }
  );

  // Generate new recommendations
  const { 
    mutate: generateRecommendations, 
    isLoading: isGenerating 
  } = useQuery(
    'generate-recommendations',
    () => recommendationsAPI.generateRecommendations(),
    {
      enabled: false,
      onSuccess: () => {
        refetchPersonalized();
      },
    }
  );

  const handleAddToCart = (productId) => {
    console.log('Add to cart:', productId);
  };

  const handleToggleWishlist = (productId) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return newWishlist;
    });
  };

  const handleRefresh = () => {
    if (activeTab === 'personalized') {
      refetchPersonalized();
    }
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'personalized':
        return { data: personalizedData, loading: personalizedLoading };
      case 'seasonal':
        return { data: seasonalData, loading: seasonalLoading };
      case 'trending':
        return { data: trendingData, loading: trendingLoading };
      case 'bundles':
        return { data: bundlesData, loading: bundlesLoading };
      default:
        return { data: null, loading: false };
    }
  };

  const { data: currentData, loading: currentLoading } = getCurrentData();
  const products = currentData?.data?.products || [];
  const bundles = currentData?.data?.bundles || [];

  const renderProducts = () => {
    if (currentLoading) {
      return <LoadingSpinner text="Loading recommendations..." />;
    }

    if (products.length === 0) {
      return (
        <EmptyState>
          <EmptyStateIcon>
            <Sparkles size={24} />
          </EmptyStateIcon>
          <EmptyStateTitle>No recommendations found</EmptyStateTitle>
          <EmptyStateText>
            {activeTab === 'personalized' 
              ? 'We need more information about your preferences to provide personalized recommendations.'
              : 'No products available in this category at the moment.'
            }
          </EmptyStateText>
          {activeTab === 'personalized' && user && (
            <GenerateButton 
              onClick={() => generateRecommendations()}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="loading" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  Generate Recommendations
                </>
              )}
            </GenerateButton>
          )}
        </EmptyState>
      );
    }

    return (
      <ProductsGrid>
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isInWishlist={wishlist.has(product._id)}
          />
        ))}
      </ProductsGrid>
    );
  };

  const renderBundles = () => {
    if (currentLoading) {
      return <LoadingSpinner text="Loading bundles..." />;
    }

    if (bundles.length === 0) {
      return (
        <EmptyState>
          <EmptyStateIcon>
            <Gift size={24} />
          </EmptyStateIcon>
          <EmptyStateTitle>No bundles available</EmptyStateTitle>
          <EmptyStateText>
            We're working on creating amazing product bundles for you. Check back soon!
          </EmptyStateText>
        </EmptyState>
      );
    }

    return (
      <div>
        {bundles.map((bundle) => (
          <BundleSection key={bundle.id}>
            <BundleHeader>
              <BundleIcon>
                <Gift size={20} />
              </BundleIcon>
              <div>
                <BundleTitle>{bundle.name}</BundleTitle>
                <BundleDescription>{bundle.description}</BundleDescription>
              </div>
            </BundleHeader>
            <BundleProducts>
              {bundle.products?.map((product, index) => (
                <BundleProduct key={index}>
                  <BundleProductName>{product.name}</BundleProductName>
                  <BundleProductPrice>
                    ₹{product.pricing?.sellingPrice?.toLocaleString()}
                  </BundleProductPrice>
                </BundleProduct>
              ))}
            </BundleProducts>
          </BundleSection>
        ))}
      </div>
    );
  };

  return (
    <RecommendationsContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <HeroTitle>Smart Recommendations</HeroTitle>
          <HeroSubtitle>
            Discover products tailored to your business needs with our AI-powered recommendation engine.
          </HeroSubtitle>
        </HeroContent>
      </HeroSection>

      {/* Content Section */}
      <ContentSection>
        <Container>
          <SectionHeader>
            <SectionTitle>Recommended for You</SectionTitle>
            {activeTab === 'personalized' && (
              <RefreshButton onClick={handleRefresh} disabled={currentLoading}>
                <RefreshCw size={16} />
                Refresh
              </RefreshButton>
            )}
          </SectionHeader>

          <TabsContainer>
            <Tab
              active={activeTab === 'personalized'}
              onClick={() => setActiveTab('personalized')}
            >
              <Sparkles size={16} style={{ marginRight: '0.5rem' }} />
              Personalized
            </Tab>
            <Tab
              active={activeTab === 'seasonal'}
              onClick={() => setActiveTab('seasonal')}
            >
              <TrendingUp size={16} style={{ marginRight: '0.5rem' }} />
              Seasonal
            </Tab>
            <Tab
              active={activeTab === 'trending'}
              onClick={() => setActiveTab('trending')}
            >
              <Star size={16} style={{ marginRight: '0.5rem' }} />
              Trending
            </Tab>
            <Tab
              active={activeTab === 'bundles'}
              onClick={() => setActiveTab('bundles')}
            >
              <Gift size={16} style={{ marginRight: '0.5rem' }} />
              Bundles
            </Tab>
          </TabsContainer>

          {activeTab === 'bundles' ? renderBundles() : renderProducts()}
        </Container>
      </ContentSection>
    </RecommendationsContainer>
  );
};

export default Recommendations;
