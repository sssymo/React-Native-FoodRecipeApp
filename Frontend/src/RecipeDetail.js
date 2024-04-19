import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import {BASE_URL} from "../constants/ip";
import Carousel from 'react-native-snap-carousel';
import StarRating from 'react-native-star-rating';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();
const RecipeDetailScreen = ({ route, navigation }) => {
  const { recipe } = route.params;
  const [difficulty, setDifficulty] = useState(recipe.attributes.difficult);
  const [rating, setRating] = useState(recipe.attributes.rate);

  const renderSeparator = (style) => (
    <View style={[styles.separator, style]} />
  );

  const getImageUrl = (imageName) => {
    return `http://${BASE_URL}:1337${imageName.url}`;
  };

  const renderRecipeDetails = () => {
    return (
      <View style={styles.container}>
        {renderSeparator(styles.carouselSeparator)}
        <Carousel
          data={recipe.attributes.carousel.data}
          renderItem={({ item }) => (
            <Image
              style={styles.carouselImage}
              source={{ uri: getImageUrl(item.attributes) }}
            />
          )}
          sliderWidth={300}
          itemWidth={300}
          inactiveSlideOpacity={0.7}
          inactiveSlideScale={0.9}
          containerCustomStyle={{ overflow: 'visible' }}
          activeSlideAlignment="center"
          layout="default"
          loop={true}
        />
        {renderSeparator(styles.carouselSeparator)}
        <Text style={styles.recipeName}>{recipe.attributes.name}</Text>
        
        {renderSeparator()}
        <Text style={styles.sectionTitle} >Descrizione:</Text>
        <Text style={styles.description}>{recipe.attributes.description}</Text>
        {renderSeparator()}
        <Text style={styles.sectionTitle}>Ingredienti:</Text>
        <Text style={styles.ingredients}>{recipe.attributes.components}</Text>
        {renderSeparator()}
        <Text style={styles.sectionTitle}>Istruzioni:</Text>
        <Text style={styles.instructions}>{recipe.attributes.instructions}</Text>
        {renderSeparator()}
        <View style={styles.difficultyContainer}>
          <Text style={styles.difficultyLabel}>Difficoltà:</Text>
          <StarRating
            disabled={true}
            maxStars={5}
            rating={difficulty}
            halfStarEnabled={true} 
            selectedStar={(difficulty) => handleDifficultyRating(difficulty)}
            fullStarColor={'orange'}
          />
        </View>
        
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingLabel}>Valutazione:</Text>
          <StarRating
            disabled={true}
            maxStars={5}
            rating={rating}
            halfStarEnabled={true} 
            selectedStar={(rating) => handleRating(rating)}
            fullStarColor={'yellow'}
          />
        </View>
      </View>
    );
  };

  return (
    <ScrollView showsVerticalScrollIndicator='false' style={styles.scrollView}>
      {recipe ? (
        renderRecipeDetails()
      ) : (
        <View style={styles.noRecipeContainer}>
          <Text style={styles.noRecipeText}>Dettagli ricetta non disponibili.</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#FCEDDA',
  },
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  carouselImage: {
    width: '100%',
    height: 200,
    marginBottom: 16,
    borderRadius: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 16,
  },
  carouselSeparator: {
    height: 2,
    backgroundColor: 'green', 
    marginVertical: 16,
    borderRadius: 5,
    alignSelf: 'center',
    width: '100%',
  },

  recipeName: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    color: '#555',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  ingredients: {
    fontSize: 16,
    marginBottom: 16,
    color: '#555',
  },
  instructions: {
    fontSize: 16,
    marginBottom: 16,
    color: '#555',
  },
  difficultyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  difficultyLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  ratingLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  noRecipeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noRecipeText: {
    fontSize: 16,
    color: '#555',
  },
});

export default RecipeDetailScreen;
