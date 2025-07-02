import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { useDatabase, useProducts } from '../../infrastructure/hooks/useDatabase';

export const DatabaseExample: React.FC = () => {
  const { isConnected, isLoading, error, connect } = useDatabase();
  const {
    products,
    loading: productsLoading,
    error: productsError,
    loadProducts,
    searchProducts,
    createProduct,
  } = useProducts();

  const [searchTerm, setSearchTerm] = useState('');
  const [newProduct, setNewProduct] = useState({
    productName: '',
    description: '',
    price: '',
    stockQuantity: '',
  });

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      await searchProducts(searchTerm);
    } else {
      await loadProducts();
    }
  };

  const handleCreateProduct = async () => {
    if (!newProduct.productName || !newProduct.price || !newProduct.stockQuantity) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      await createProduct({
        productName: newProduct.productName,
        description: newProduct.description || undefined,
        price: parseFloat(newProduct.price),
        stockQuantity: parseInt(newProduct.stockQuantity),
      });

      // Reset form
      setNewProduct({
        productName: '',
        description: '',
        price: '',
        stockQuantity: '',
      });

      Alert.alert('Success', 'Product created successfully');
    } catch (err) {
      Alert.alert('Error', 'Failed to create product');
    }
  };

  const renderProduct = ({ item }: { item: any }) => (
    <View style={styles.productItem}>
      <Text style={styles.productName}>{item.ProductName}</Text>
      <Text style={styles.productDescription}>{item.Description}</Text>
      <View style={styles.productDetails}>
        <Text style={styles.productPrice}>${item.Price}</Text>
        <Text style={styles.productStock}>Stock: {item.StockQuantity}</Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Connecting to database...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Database Error: {error}</Text>
        <TouchableOpacity style={styles.button} onPress={connect}>
          <Text style={styles.buttonText}>Retry Connection</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <Text>Not connected to database</Text>
        <TouchableOpacity style={styles.button} onPress={connect}>
          <Text style={styles.buttonText}>Connect</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>StockFlow Database Example</Text>
      <Text style={styles.status}>✅ Connected to database</Text>

      {/* Search Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Search Products</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search products..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Create Product Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Create New Product</Text>
        <TextInput
          style={styles.input}
          placeholder="Product Name *"
          value={newProduct.productName}
          onChangeText={(text) => setNewProduct({ ...newProduct, productName: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={newProduct.description}
          onChangeText={(text) => setNewProduct({ ...newProduct, description: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Price *"
          value={newProduct.price}
          onChangeText={(text) => setNewProduct({ ...newProduct, price: text })}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Stock Quantity *"
          value={newProduct.stockQuantity}
          onChangeText={(text) => setNewProduct({ ...newProduct, stockQuantity: text })}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.button} onPress={handleCreateProduct}>
          <Text style={styles.buttonText}>Create Product</Text>
        </TouchableOpacity>
      </View>

      {/* Products List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Products ({products.length})</Text>
        {productsLoading ? (
          <Text>Loading products...</Text>
        ) : productsError ? (
          <Text style={styles.errorText}>Error: {productsError}</Text>
        ) : (
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.ProductId.toString()}
            style={styles.productsList}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  status: {
    fontSize: 16,
    color: 'green',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 4,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  productsList: {
    maxHeight: 300,
  },
  productItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  productStock: {
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
});