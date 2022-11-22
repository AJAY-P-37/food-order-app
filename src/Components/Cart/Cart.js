import React, { useContext, useState } from 'react';

import Modal from '../UI/Modal';
import CartItem from './CartItem';
import classes from './Cart.module.css';
import CartContext from '../../store/cart-context';
import Checkout from './Checkout';

const Cart = (props) => {

    const [isCheckOut, setIsCheckout] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [didSubmit, setDidSubmit] = useState(false);
    const [submitContent, setSubmitContent] = useState('Successfully sent the order');

    const cartCtx = useContext(CartContext);

    const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
    const hasItems = cartCtx.items.length > 0;

    const cartItemRemoveHandler = (id) => {
        cartCtx.removeItem(id);
    };

    const cartItemAddHandler = (item) => {
        cartCtx.addItem({ ...item, amount: 1 });
    };

    const orderHandler = () => {
        setIsCheckout(true);
    }
    const submitOrderHandler = async (userdata) => {
        setIsSubmitting(true);
        fetch('https://react-food-order-app-fa868-default-rtdb.asia-southeast1.firebasedatabase.app/order.json', {
            method: 'POST',
            body: JSON.stringify({
                userData: userdata,
                orderItems: cartCtx.items
            })
        }).then((response) => {

            setIsSubmitting(false);
            if (response.ok) {
                setSubmitContent('Successfully sent the order');
            } else {
                setSubmitContent('Error. Try again');
            }
            setDidSubmit(true);
        });

    }

    const modalActions = (
        <div className={classes.actions}>
            <button className={classes['button--alt']} onClick={props.onClose}>
                Close
            </button>
            {hasItems && <button className={classes.button} onClick={orderHandler}>Order</button>}
        </div>
    );
    const cartItems = (
        <ul className={classes['cart-items']}>
            {cartCtx.items.map((item) => (
                <CartItem
                    key={item.id}
                    name={item.name}
                    amount={item.amount}
                    price={item.price}
                    onRemove={cartItemRemoveHandler.bind(null, item.id)}
                    onAdd={cartItemAddHandler.bind(null, item)}
                />
            ))}
        </ul>
    );

    const cartModalContent = (
        <React.Fragment>
            {cartItems}
            <div className={classes.total}>
                <span>Total Amount</span>
                <span>{totalAmount}</span>
            </div>
            {isCheckOut && <Checkout onConfirm={submitOrderHandler} onCancel={props.onClose} />}
            {!isCheckOut && modalActions}
        </React.Fragment>
    )

    const isSubmittingModalContent = <p>Submitting...</p>

    const didSubmitModalContent = (
        <React.Fragment>
            <p>{submitContent}</p>
            <div className={classes.actions}>
                <button className={classes.button} onClick={props.onClose}>
                    Close
                </button>
            </div>
        </React.Fragment>
    );



    return (
        <Modal onClose={props.onClose}>
            {!isSubmitting && !didSubmit && cartModalContent}
            {isSubmitting && isSubmittingModalContent}
            {didSubmit && didSubmitModalContent}
        </Modal>
    );
};

export default Cart;