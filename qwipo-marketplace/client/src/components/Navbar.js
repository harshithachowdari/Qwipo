import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Search, 
  User, 
  ShoppingCart, 
  Menu, 
  X, 
  LogOut, 
  Settings, 
  Heart,
  Bell,
  Award,
  ChevronDown
} from 'lucide-react';
import styled from 'styled-components';

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: ${props => (props.className?.includes('scrolled') ? '0 2px 8px rgba(0,0,0,0.06)' : 'none')};
`;

const NavContent = styled.div`
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
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: var(--gray-600);
  text-decoration: none;
  font-weight: 500;
  font-size: var(--font-size-sm);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-lg);
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    color: var(--primary-600);
    background: var(--primary-50);
  }
  
  &.active {
    color: var(--primary-600);
    background: var(--primary-100);
    font-weight: 600;
  }
`;


const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 500px;
  margin: 0 var(--space-6);
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: var(--space-3) var(--space-4) var(--space-3) var(--space-12);
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  background: var(--gray-50);
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--primary-500);
    background: white;
    box-shadow: 0 0 0 3px var(--primary-100);
  }
  
  &::placeholder {
    color: var(--gray-500);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: var(--space-4);
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-500);
  pointer-events: none;
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
`;

const ActionButton = styled.button`
  position: relative;
  display: flex;
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
  
  &:hover {
    background: var(--primary-100);
    color: var(--primary-600);
    transform: translateY(-1px);
  }
  
  &.primary {
    background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
    color: white;
    
    &:hover {
      background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
  }
`;

const Badge = styled.div`
  position: absolute;
  top: -2px;
  right: -2px;
  background: var(--error-500);
  color: white;
  font-size: var(--font-size-xs);
  font-weight: 600;
  padding: 2px 6px;
  border-radius: var(--radius-full);
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserMenu = styled.div`
  position: relative;
  display: inline-block;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--gray-100);
  border: none;
  border-radius: var(--radius-lg);
  color: var(--gray-700);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: var(--font-size-sm);
  font-weight: 500;
  
  &:hover {
    background: var(--primary-100);
    color: var(--primary-600);
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: var(--font-size-sm);
`;

const UserDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  min-width: 250px;
  padding: var(--space-2);
  z-index: 100;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s ease;
`;

const UserInfo = styled.div`
  padding: var(--space-4);
  border-bottom: 1px solid var(--gray-200);
  margin-bottom: var(--space-2);
`;

const UserName = styled.div`
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: var(--space-1);
`;

const UserEmail = styled.div`
  font-size: var(--font-size-xs);
  color: var(--gray-500);
`;

const UserMenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: none;
  border: none;
  color: var(--gray-700);
  text-align: left;
  border-radius: var(--radius-lg);
  transition: all 0.2s ease;
  font-size: var(--font-size-sm);
  cursor: pointer;
  
  &:hover {
    background: var(--primary-50);
    color: var(--primary-600);
  }
  
  &.danger {
    color: var(--error-600);
    
    &:hover {
      background: var(--error-50);
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
  
  @media (max-width: 1024px) {
    display: flex;
  }
  
  &:hover {
    background: var(--primary-100);
    color: var(--primary-600);
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 4rem;
  left: 0;
  right: 0;
  background: white;
  border-bottom: 1px solid var(--gray-200);
  box-shadow: var(--shadow-lg);
  padding: var(--space-4);
  z-index: 40;
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-100%)'};
  transition: transform 0.3s ease;
`;

const MobileNavLink = styled(Link)`
  display: block;
  padding: var(--space-3) var(--space-4);
  color: var(--gray-700);
  text-decoration: none;
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-2);
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--primary-50);
    color: var(--primary-600);
  }
  
  &.active {
    background: var(--primary-100);
    color: var(--primary-600);
  }
`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);




























  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  const isActive = (path) => {
    return location.pathname === path;
  };

  const dashboardPath = user?.userType === 'distributor' ? '/dashboard/distributor' : '/dashboard/retailer';

  return (
    <>
    <NavbarContainer className={isScrolled ? 'scrolled' : ''}>
      <NavContent>
        {/* Logo */}
        <Logo to="/">
          <LogoIcon>Q</LogoIcon>
          Qwipo
        </Logo>

        {/* Desktop Navigation */}
        <NavLinks>
          <NavLink to="/" className={isActive('/') ? 'active' : ''}>
            Home
          </NavLink>
          <NavLink to="/search" className={isActive('/search') ? 'active' : ''}>
            Search
          </NavLink>
          <NavLink to="/recommendations" className={isActive('/recommendations') ? 'active' : ''}>
            Recommendations
          </NavLink>
          {user && (
            <NavLink
              to={dashboardPath}
              className={isActive('/dashboard/retailer') || isActive('/dashboard/distributor') ? 'active' : ''}
            >
              Dashboard
            </NavLink>
          )}
        </NavLinks>

        {/* Search */}
        <SearchContainer>
          <form onSubmit={handleSearch}>
            <SearchIcon>
              <Search size={18} />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search products, brands, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </SearchContainer>

        {/* Action Buttons */}
        <ActionButtons>
          <ActionButton title="Wishlist">
            <Heart size={18} />
            <Badge>3</Badge>
          </ActionButton>
          <ActionButton title="Notifications">
            <Bell size={18} />
            <Badge>5</Badge>
          </ActionButton>
          <ActionButton title="Cart" className="primary">
            <ShoppingCart size={18} />
            <Badge>2</Badge>
          </ActionButton>

          {user ? (
            <UserMenu>
              <UserButton onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                <UserAvatar>
                  {user.firstName?.charAt(0) || 'U'}
                </UserAvatar>
                <span>{user.firstName || 'User'}</span>
                <ChevronDown size={16} />
              </UserButton>
              <UserDropdown isOpen={isUserMenuOpen}>
                <UserInfo>
                  <UserName>{user.firstName} {user.lastName}</UserName>
                  <UserEmail>{user.email}</UserEmail>
                </UserInfo>
                <UserMenuItem onClick={() => navigate('/profile')}>
                  <User size={16} />
                  Profile
                </UserMenuItem>
                <UserMenuItem onClick={() => navigate(dashboardPath)}>
                  <Award size={16} />
                  Dashboard
                </UserMenuItem>
                <UserMenuItem onClick={() => navigate('/settings')}>
                  <Settings size={16} />
                  Settings
                </UserMenuItem>
                <UserMenuItem onClick={handleLogout} className="danger">
                  <LogOut size={16} />
                  Logout
                </UserMenuItem>
              </UserDropdown>
            </UserMenu>
          ) : (
            <ActionButton
              onClick={() => navigate('/login')}
              className="primary"
              style={{ padding: 'var(--space-2) var(--space-4)', width: 'auto' }}
            >
              <User size={16} />
              Login
            </ActionButton>
          )}

          <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </MobileMenuButton>
        </ActionButtons>
      </NavContent>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen}>
        <MobileNavLink to="/" className={isActive('/') ? 'active' : ''}>
          Home
        </MobileNavLink>
        <MobileNavLink to="/search" className={isActive('/search') ? 'active' : ''}>
          Search
        </MobileNavLink>
        <MobileNavLink to="/recommendations" className={isActive('/recommendations') ? 'active' : ''}>
          Recommendations
        </MobileNavLink>
        {user && (
          <MobileNavLink
            to={dashboardPath}
            className={isActive('/dashboard/retailer') || isActive('/dashboard/distributor') ? 'active' : ''}
          >
            Dashboard
          </MobileNavLink>
        )}
        <MobileNavLink to="/profile" className={isActive('/profile') ? 'active' : ''}>
          Profile
        </MobileNavLink>
      </MobileMenu>
    </NavbarContainer>
    {/* Spacer to offset fixed navbar height */}
    <div style={{ height: '4rem' }} />
    </>
  );
};

export default Navbar;