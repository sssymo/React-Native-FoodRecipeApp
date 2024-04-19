import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './src/Home';
import Recipes from './src/Recipes';
import RecipeDetail from './src/RecipeDetail';
const Stack = createStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
        <Stack.Screen name="RecipeDetail" component={RecipeDetail} options={{ title: 'Recipe Details' }} />
        <Stack.Screen name="Recipes" component={Recipes}  />
      </Stack.Navigator>
    </NavigationContainer>
    
  );
};
export default App;
