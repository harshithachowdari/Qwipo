import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Filter, SortAsc, Grid, List, X } from 'lucide-react';
import styled from 'styled-components';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { productsAPI, searchAPI } from '../services/api';

const SearchContainer = styled.div`
  min-height: calc(100vh - 4rem);
  background: #f8fafc;
`;

const SearchHeader = styled.div`
  background: white;
  padding: 2rem 0;
  border-bottom: 1px solid #e2e8f0;
`;

const SearchContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const SearchTop = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
`;

const SearchSection = styled.div`
  flex: 1;
  max-width: 600px;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
  }
`;

const SortButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
  }
`;

const SearchResults = styled.div`
  display: flex;
  gap: 2rem;
  padding: 2rem 0;
`;

const Sidebar = styled.div`
  width: 250px;
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  height: fit-content;
  position: sticky;
  top: 2rem;
`;

const SidebarTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1e293b;
`;

const FilterGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FilterLabel = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #374151;
  font-size: 0.875rem;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: white;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const FilterCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;

  input[type="checkbox"] {
    margin: 0;
  }
`;

const ClearFiltersButton = styled.button`
  width: 100%;
  padding: 0.5rem;
  background: #f1f5f9;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #6b7280;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
  }
`;

const MainContent = styled.div`
  flex: 1;
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  background: white;
  padding: 1rem;
  border-radius: 0.75rem;
`;

const ResultsCount = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const ViewButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid #d1d5db;
  background: ${props => props.active ? '#3b82f6' : 'white'};
  color: ${props => props.active ? 'white' : '#6b7280'};
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const ProductsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 0.75rem;
`;

const NoResultsTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1e293b;
`;

const NoResultsText = styled.p`
  color: #6b7280;
  margin-bottom: 1.5rem;
`;

const SearchSuggestions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
`;

const SuggestionTag = styled.button`
  padding: 0.5rem 1rem;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
    color: #374151;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: #3b82f6;
    color: #3b82f6;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }
`;

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    sortBy: 'relevance',
    page: 1,
    limit: 20
  });
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState(new Set());

  const query = searchParams.get('q') || '';

  // Fetch search results
  const { data: searchData, isLoading, error } = useQuery(
    ['search', query, filters],
    () => {
      if (query) {
        return productsAPI.searchProducts({
          q: query,
          page: filters.page,
          limit: filters.limit,
          sortBy: filters.sortBy
        });
      } else {
        return productsAPI.getProducts({
          page: filters.page,
          limit: filters.limit,
          sortBy: filters.sortBy,
          category: filters.category,
          brand: filters.brand,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice
        });
      }
    },
    {
      enabled: true,
      staleTime: 5 * 60 * 1000,
    }
  );

  // Fetch filter options
  const { data: filterData } = useQuery(
    'search-filters',
    () => searchAPI.getFilters({ category: filters.category }),
    {
      staleTime: 10 * 60 * 1000,
    }
  );

  useEffect(() => {
    if (query) {
      setFilters(prev => ({ ...prev, page: 1 }));
    }
  }, [query]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handleSearch = (searchQuery) => {
    setSearchParams({ q: searchQuery });
  };

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

  const clearFilters = () => {
    setFilters({
      category: '',
      subcategory: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      sortBy: 'relevance',
      page: 1,
      limit: 20
    });
  };

  const products = searchData?.data?.products || [];
  const pagination = searchData?.data?.pagination || {};
  const filterOptions = filterData?.data || {};

  const renderProduct = (product) => (
    <ProductCard
      key={product._id}
      product={product}
      onAddToCart={handleAddToCart}
      onToggleWishlist={handleToggleWishlist}
      isInWishlist={wishlist.has(product._id)}
    />
  );

  return (
    <SearchContainer>
      <SearchHeader>
        <SearchContent>
          <SearchTop>
            <SearchSection>
              <SearchBar
                placeholder="Search products..."
                onSearch={handleSearch}
                defaultValue={query}
              />
            </SearchSection>
            <FilterButton onClick={() => setShowFilters(!showFilters)}>
              <Filter size={16} />
              Filters
            </FilterButton>
            <SortButton>
              <SortAsc size={16} />
              Sort
            </SortButton>
          </SearchTop>
        </SearchContent>
      </SearchHeader>

      <SearchContent>
        <SearchResults>
          {showFilters && (
            <Sidebar>
              <SidebarTitle>Filters</SidebarTitle>
              
              <FilterGroup>
                <FilterLabel>Category</FilterLabel>
                <FilterSelect
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  {filterOptions.categories?.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat._id} ({cat.count})
                    </option>
                  ))}
                </FilterSelect>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Brand</FilterLabel>
                <FilterSelect
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                >
                  <option value="">All Brands</option>
                  {filterOptions.brands?.map(brand => (
                    <option key={brand._id} value={brand._id}>
                      {brand._id} ({brand.count})
                    </option>
                  ))}
                </FilterSelect>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Price Range</FilterLabel>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <FilterInput
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  />
                  <FilterInput
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  />
                </div>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Rating</FilterLabel>
                <FilterSelect
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                >
                  <option value="">All Ratings</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                  <option value="1">1+ Stars</option>
                </FilterSelect>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Sort By</FilterLabel>
                <FilterSelect
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <option value="relevance">Relevance</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="newest">Newest</option>
                  <option value="name">Name</option>
                </FilterSelect>
              </FilterGroup>

              <ClearFiltersButton onClick={clearFilters}>
                Clear All Filters
              </ClearFiltersButton>
            </Sidebar>
          )}

          <MainContent>
            <ResultsHeader>
              <ResultsCount>
                {isLoading ? 'Searching...' : `${pagination.total || 0} products found`}
                {query && ` for "${query}"`}
              </ResultsCount>
              <ViewToggle>
                <ViewButton
                  active={viewMode === 'grid'}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid size={16} />
                </ViewButton>
                <ViewButton
                  active={viewMode === 'list'}
                  onClick={() => setViewMode('list')}
                >
                  <List size={16} />
                </ViewButton>
              </ViewToggle>
            </ResultsHeader>

            {isLoading ? (
              <LoadingSpinner text="Searching products..." />
            ) : error ? (
              <NoResults>
                <NoResultsTitle>Search Error</NoResultsTitle>
                <NoResultsText>Something went wrong while searching. Please try again.</NoResultsText>
              </NoResults>
            ) : products.length === 0 ? (
              <NoResults>
                <NoResultsTitle>No products found</NoResultsTitle>
                <NoResultsText>
                  {query ? `No products found for "${query}". Try different keywords.` : 'No products match your current filters.'}
                </NoResultsText>
                <SearchSuggestions>
                  <SuggestionTag onClick={() => handleSearch('tea')}>Tea</SuggestionTag>
                  <SuggestionTag onClick={() => handleSearch('sugar')}>Sugar</SuggestionTag>
                  <SuggestionTag onClick={() => handleSearch('rice')}>Rice</SuggestionTag>
                  <SuggestionTag onClick={() => handleSearch('oil')}>Oil</SuggestionTag>
                </SearchSuggestions>
              </NoResults>
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <ProductsGrid>
                    {products.map(renderProduct)}
                  </ProductsGrid>
                ) : (
                  <ProductsList>
                    {products.map(renderProduct)}
                  </ProductsList>
                )}

                {pagination.pages > 1 && (
                  <Pagination>
                    <PaginationButton
                      disabled={pagination.current === 1}
                      onClick={() => handleFilterChange('page', pagination.current - 1)}
                    >
                      Previous
                    </PaginationButton>
                    
                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <PaginationButton
                          key={page}
                          className={pagination.current === page ? 'active' : ''}
                          onClick={() => handleFilterChange('page', page)}
                        >
                          {page}
                        </PaginationButton>
                      );
                    })}
                    
                    <PaginationButton
                      disabled={pagination.current === pagination.pages}
                      onClick={() => handleFilterChange('page', pagination.current + 1)}
                    >
                      Next
                    </PaginationButton>
                  </Pagination>
                )}
              </>
            )}
          </MainContent>
        </SearchResults>
      </SearchContent>
    </SearchContainer>
  );
};

export default Search;
