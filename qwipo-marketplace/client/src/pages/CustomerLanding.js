import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  TrendingUp, 
  Gift, 
  Shield, 
  Zap, 
  ShoppingBag, 
  Users, 
  Award,
  Sparkles,
  Target,
  BarChart3,
  Menu,
  X
} from 'lucide-react';
import styled from 'styled-components';

const LandingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, var(--gray-50) 0%, var(--primary-50) 100%);
`;

const Header = styled.header`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--gray-200);
  position: sticky;
  top: 0;
  z-index: 50;
`;

const HeaderContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
`;

const Logo = styled(Link)`
  font-size: var(--font-size-2xl);
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: var(--font-size-lg);
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-8);
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a`
  color: var(--gray-600);
  text-decoration: none;
  font-weight: 500;
  font-size: var(--font-size-sm);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-lg);
  transition: all 0.2s ease;
  
  &:hover {
    color: var(--primary-600);
    background: var(--primary-50);
  }
`;

const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
`;

const AuthButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  font-weight: 500;
  font-size: var(--font-size-sm);
  text-decoration: none;
  transition: all 0.2s ease;
  
  &.primary {
    background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
    color: white;
    
    &:hover {
      background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }
  }
  
  &.secondary {
    background: transparent;
    color: var(--primary-600);
    border: 2px solid var(--primary-200);
    
    &:hover {
      background: var(--primary-50);
      border-color: var(--primary-300);
    }
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--gray-100);
  border: none;
  border-radius: var(--radius-lg);
  color: var(--gray-600);
  cursor: pointer;
  transition: all 0.2s ease;
  
  @media (max-width: 768px) {
    display: flex;
  }
  
  &:hover {
    background: var(--primary-100);
    color: var(--primary-600);
  }
`;

const HeroSection = styled.section`
  position: relative;
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 50%, var(--primary-900) 100%);
  color: white;
  padding: var(--space-20) 0;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="a" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="%23ffffff" stop-opacity="0.1"/><stop offset="100%" stop-color="%23ffffff" stop-opacity="0"/></radialGradient></defs><circle cx="200" cy="200" r="100" fill="url(%23a)"/><circle cx="800" cy="300" r="150" fill="url(%23a)"/><circle cx="400" cy="700" r="120" fill="url(%23a)"/></svg>');
    opacity: 0.1;
  }
`;

const HeroContent = styled.div`
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-4);
  text-align: center;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  font-size: var(--font-size-5xl);
  font-weight: 800;
  margin-bottom: var(--space-6);
  line-height: 1.1;
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: var(--font-size-4xl);
  }
  
  @media (max-width: 640px) {
    font-size: var(--font-size-3xl);
  }
`;

const HeroSubtitle = styled.p`
  font-size: var(--font-size-xl);
  margin-bottom: var(--space-8);
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  font-weight: 400;
  
  @media (max-width: 768px) {
    font-size: var(--font-size-lg);
  }
`;

const HeroActions = styled.div`
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: var(--space-12);
`;

const HeroButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-8);
  background: white;
  color: var(--primary-600);
  border-radius: var(--radius-xl);
  font-weight: 600;
  font-size: var(--font-size-lg);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-lg);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-xl);
    background: var(--primary-50);
  }
`;

const HeroButtonSecondary = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-8);
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-xl);
  font-weight: 600;
  font-size: var(--font-size-lg);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-8);
  margin-top: var(--space-12);
`;

const StatItem = styled.div`
  text-align: center;
  padding: var(--space-6);
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-xl);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const StatNumber = styled.div`
  font-size: var(--font-size-3xl);
  font-weight: 800;
  margin-bottom: var(--space-2);
  color: white;
`;

const StatLabel = styled.div`
  font-size: var(--font-size-sm);
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const FeaturesSection = styled.section`
  padding: var(--space-20) 0;
  background: white;
`;

const FeaturesContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-4);
`;

const SectionTitle = styled.h2`
  font-size: var(--font-size-4xl);
  font-weight: 700;
  text-align: center;
  margin-bottom: var(--space-4);
  color: var(--gray-800);
`;

const SectionSubtitle = styled.p`
  font-size: var(--font-size-lg);
  text-align: center;
  margin-bottom: var(--space-16);
  color: var(--gray-600);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-8);
  margin-bottom: var(--space-16);
`;

const FeatureCard = styled.div`
  padding: var(--space-8);
  background: white;
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-200);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--primary-200);
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto var(--space-6);
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
  border-radius: var(--radius-2xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: var(--font-size-2xl);
`;

const FeatureTitle = styled.h3`
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--space-4);
  color: var(--gray-800);
`;

const FeatureDescription = styled.p`
  color: var(--gray-600);
  line-height: 1.6;
`;

const CTA = styled.section`
  padding: var(--space-20) 0;
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%);
  color: white;
  text-align: center;
`;

const CTAContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 var(--space-4);
`;

const CTATitle = styled.h2`
  font-size: var(--font-size-4xl);
  font-weight: 700;
  margin-bottom: var(--space-6);
`;

const CTADescription = styled.p`
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-8);
  opacity: 0.9;
`;

const CustomerLanding = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <Zap size={32} />,
      title: 'AI-Powered Search',
      description: 'Find exactly what you need with our intelligent search that understands context and intent.'
    },
    {
      icon: <Gift size={32} />,
      title: 'Personalized Bundles',
      description: 'Get curated product bundles tailored to your business needs and preferences.'
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Smart Recommendations',
      description: 'Discover trending products and seasonal recommendations powered by machine learning.'
    },
    {
      icon: <Shield size={32} />,
      title: 'Secure Transactions',
      description: 'Bank-level security for all your transactions with encrypted payment processing.'
    },
    {
      icon: <Award size={32} />,
      title: 'Loyalty Rewards',
      description: 'Earn points on every purchase and unlock exclusive benefits as you grow your business.'
    },
    {
      icon: <BarChart3 size={32} />,
      title: 'Analytics Dashboard',
      description: 'Track your performance with detailed insights and analytics for better decision making.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Active Retailers' },
    { number: '50,000+', label: 'Products Available' },
    { number: '99.9%', label: 'Uptime Guarantee' },
    { number: '24/7', label: 'Customer Support' }
  ];

  return (
    <LandingContainer>
      {/* Header */}
      <Header>
        <HeaderContent>
          <Logo to="/">
            <LogoIcon>Q</LogoIcon>
            Qwipo
          </Logo>

          <NavLinks>
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#about">About</NavLink>
            <NavLink href="#contact">Contact</NavLink>
          </NavLinks>

          <AuthButtons>
            <AuthButton to="/login" className="secondary">
              Login
            </AuthButton>
            <AuthButton to="/register" className="primary">
              <ShoppingBag size={16} />
              Get Started
            </AuthButton>
            <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </MobileMenuButton>
          </AuthButtons>
        </HeaderContent>
      </Header>

      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <HeroTitle>
            Welcome to 
            <span style={{ color: '#fbbf24' }}> Qwipo Marketplace</span>
          </HeroTitle>
          <HeroSubtitle>
            The ultimate B2B marketplace powered by AI. Discover products, 
            get personalized recommendations, and grow your business with confidence.
          </HeroSubtitle>
          <HeroActions>
            <HeroButton to="/register">
              <ShoppingBag size={20} />
              Start Shopping
              <ArrowRight size={20} />
            </HeroButton>
            <HeroButtonSecondary to="/login">
              <Users size={20} />
              Sign In
            </HeroButtonSecondary>
          </HeroActions>
          <StatsSection>
            {stats.map((stat, index) => (
              <StatItem key={index}>
                <StatNumber>{stat.number}</StatNumber>
                <StatLabel>{stat.label}</StatLabel>
              </StatItem>
            ))}
          </StatsSection>
        </HeroContent>
      </HeroSection>

      {/* Features Section */}
      <FeaturesSection id="features">
        <FeaturesContainer>
          <SectionTitle>Why Choose Qwipo?</SectionTitle>
          <SectionSubtitle>
            We combine cutting-edge technology with deep industry expertise 
            to deliver the best B2B marketplace experience.
          </SectionSubtitle>
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard key={index} className="fade-in">
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </FeaturesContainer>
      </FeaturesSection>

      {/* CTA Section */}
      <CTA>
        <CTAContent>
          <CTATitle>Ready to Transform Your Business?</CTATitle>
          <CTADescription>
            Join thousands of successful retailers who trust Qwipo for their B2B needs. 
            Start your journey today and experience the future of commerce.
          </CTADescription>
          <HeroActions>
            <HeroButton to="/register" style={{ background: 'white', color: 'var(--primary-600)' }}>
              <Sparkles size={20} />
              Get Started Free
              <ArrowRight size={20} />
            </HeroButton>
            <HeroButtonSecondary to="/login">
              <Target size={20} />
              Sign In
            </HeroButtonSecondary>
          </HeroActions>
        </CTAContent>
      </CTA>
    </LandingContainer>
  );
};

export default CustomerLanding;
