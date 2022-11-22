import Card from '../UI/Card';
import MealItem from './MealItem/MealItem';
import classes from './AvailableMeals.module.css';
import { useEffect, useState } from 'react';


const AvailableMeals = (props) => {
    const [meals, setMeals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState('');

    useEffect(() => {
        const fetchMeals = async () => {
            const response = await fetch('https://react-food-order-app-fa868-default-rtdb.asia-southeast1.firebasedatabase.app/meals.json');

            if (!response.ok) {
                throw new Error('Something Went Wrong!!!');
            }
            const responseData = await response.json();

            let loadedMeals = [];

            for (const key in responseData) {
                loadedMeals.push({
                    id: key,
                    name: responseData[key].name,
                    description: responseData[key].description,
                    price: responseData[key].price,
                });
            }
            console.log(response)
            setMeals(loadedMeals);
            setIsLoading(false);
        }

        fetchMeals().then().catch(error => {
            setIsLoading(false);
            setHttpError(error.message);
        }
        );

        return () => {

        }
    }, []);

    if (isLoading) {
        return (
            <section className={classes.mealsLoading}>
                <p>Loading...</p>
            </section>
        );
    }

    if (httpError) {
        return (
            <section className={classes.mealsError}>
                <p>{httpError}</p>
            </section>
        )
    }
    const mealsList = meals.map(
        meal => (<MealItem

            key={meal.id}
            id={meal.id}
            name={meal.name}
            description={meal.description}
            price={meal.price}
        />)
    );
    return (
        <section className={classes.meals}>
            <ul>
                <Card>
                    {mealsList}
                </Card>
            </ul>
        </section>
    )
}

export default AvailableMeals;