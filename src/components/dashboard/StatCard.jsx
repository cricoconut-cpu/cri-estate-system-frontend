const StatCard = ({ title, value, icon: Icon }) => {
  return (
    <div
      className="
bg-white
rounded-xl
shadow-sm
p-6
border
"
    >
      <div
        className="
flex
items-center
justify-between
"
      >
        <div>
          <p
            className="
text-sm
text-slate-500
"
          >
            {title}
          </p>

          <h2
            className="
mt-2
text-3xl
font-bold
text-slate-900
"
          >
            {value}
          </h2>
        </div>

        {Icon && (
          <Icon
            size={32}
            className="
text-green-700
"
          />
        )}
      </div>
    </div>
  );
};

export default StatCard;
