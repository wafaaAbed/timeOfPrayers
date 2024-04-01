

import "./Paryer.css";

// eslint-disable-next-line react/prop-types
const Paryer = ({ name, time, src, nextParyerclass = null }) => {
  return (
    // card style to display all prayers details
    <div className={`card ${nextParyerclass}`} style={{ width: "18rem" }}>
      <img src={src} className="card-img-top" alt={name} />
      <div className="card-body">
        <h4 className="card-title d-flex justify-content-around">
          {name}

          </h4>
        <h4 className="text-center">{time}</h4>
      </div>

    </div>
  );
};

export default Paryer;
