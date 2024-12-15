const BuyButton = ({ onClick, className, name, price }) => {
    return (
      <div className="horizontal-container">
        <button onClick={onClick} className={className}>{name}</button>
        <p className="price">Price: {price}</p>
      </div>
    );
  }
  
  export default BuyButton;
  