import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AntDesign } from '@expo/vector-icons';

const RecipesScreen = ({ navigation }) => {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const flatListRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [sortCriteria, setSortCriteria] = useState('name');

  const handleResetFilters = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setSearchText('');
      setSelectedCategory('');
      setSortCriteria('name');
      // Go Back To The First Element Of The FlatList
      flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    }, 1100);
  };

  const opacityValue = useRef(new Animated.Value(1)).current;

  const sortRecipes = (a, b) => {
    const aValue = a.attributes[sortCriteria];
    const bValue = b.attributes[sortCriteria];

    if (sortCriteria === 'topVoted') {
      return bValue - aValue;
    } else {
      return aValue.localeCompare(bValue);
    }
  };

  useEffect(() => {
    if (refreshing) {
      Animated.timing(opacityValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {});
    } else {
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }).start();
    }
  }, [refreshing]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('http://192.168.1.6:1337/api/recipes?populate=*');
        setRecipes(response.data.data);

        const categories = Array.from(new Set(response.data.data.map(recipe => recipe.attributes.category)));
        setCategories(categories);

        setLoading(false);
      } catch (error) {
        console.error('Errore durante il recupero delle ricette:', error);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const filterByName = (recipe) => {
    return recipe.attributes.name.toLowerCase().includes(searchText.toLowerCase());
  };

  const filterByCategory = (recipe) => {
    return selectedCategory === '' || recipe.attributes.category === selectedCategory;
  };

  const renderRecipeItem = ({ item }) => {
    const imageUrl = `http://192.168.1.6:1337${item.attributes.cover.data.attributes.url}`;
    return (
      <TouchableOpacity onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}>
        <View style={styles.recipeContainer}>
          <Image
            style={styles.recipeImage}
            source={{ uri: imageUrl }}
          />
          <View style={styles.recipeInfo}>
            <Text style={styles.recipeName}>{item.attributes.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const filteredRecipes = recipes
    .filter((recipe) => filterByName(recipe) && filterByCategory(recipe))
    .sort(sortRecipes);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <>
          <View style={styles.header}>
            {showFilters && (
              <TextInput
                style={styles.searchInput}
                placeholder="Cerca ricette"
                value={searchText}
                onChangeText={(text) => setSearchText(text)}
              />
            )}
            {showFilters && (
              <TouchableOpacity onPress={handleResetFilters}>
                <Icon name="refresh" size={32} color="#000" style={styles.refreshIcon} />
              </TouchableOpacity>
            )}
          </View>
          {showFilters && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <RNPickerSelect
                onValueChange={(value) => setSelectedCategory(value)}
                items={[
                  ...categories.map(category => ({ label: category, value: category })),
                ]}
                placeholder={{ label: 'Tutte le categorie', value: '' }}
                style={styles.categoryPicker}
                value={selectedCategory}
              />
              <RNPickerSelect
                onValueChange={(value) => setSortCriteria(value)}
                value={sortCriteria}
                items={[
                  { label: 'Category', value: 'category' },
                  { label: 'Top Voted', value: 'topVoted' },
                ]}
                style={styles.categoryPicker}
                placeholder={{ label: 'Name', value: 'name' }}
              />
            </View>
          )}

          {showFilters && (
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowFilters(!showFilters)}
            >
              <AntDesign name={showFilters ? 'caretup' : 'caretdown'} size={24} color="black" />
            </TouchableOpacity>
          )}

          {!showFilters && (
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowFilters(!showFilters)}
            >
              <AntDesign name="caretdown" size={24} color="black" />
            </TouchableOpacity>
          )}

          <Animated.FlatList
            ref={flatListRef}
            showsVerticalScrollIndicator={false}
            data={filteredRecipes}
            renderItem={renderRecipeItem}
            keyExtractor={(item) => item.attributes.name}
            style={{ opacity: opacityValue }}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    alignContent: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  refreshIcon: {
    marginRight: 10,
    marginBottom: 15,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    height: 40,
    width: '85%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryPicker: {
    inputIOS: {
      height: 50,
      width: 150,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      paddingLeft: 12,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 2,
    },
  },
  recipeContainer: {
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  recipeImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  recipeInfo: {
    padding: 10,
  },
  recipeName: {
    textAlign: 'center',
    marginTop: '2%',
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterButton: {
    alignSelf: 'center',
    backgroundColor: 'white',
    width: '15%',
    height: '5%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 0.4,
    alignContent: 'center',
    borderColor: 'black',
    marginBottom: '5%',
    justifyContent: 'center',
  },
});

export default RecipesScreen;
