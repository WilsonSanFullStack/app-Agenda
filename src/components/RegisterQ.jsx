import React from "react";
import Calendar from "react-calendar";

export const RegisterQ = () => {
  return (
    <div>
      <form className="">
        <section className="text-center text-white">
          <h1>quincena</h1>
          <Calendar
            tileClassName={({ date, view }) => {
              if (view === "month") {
                if (date.getDay() === 0) return "sunday"; // Solo para domingos
                if (
                  (date.getDay() === 6) |
                  (date.getDay() === 5) |
                  (date.getDay() === 4) |
                  (date.getDay() === 3) |
                  (date.getDay() === 2) |
                  (date.getDay() === 1)
                )
                  return "week"; // Si quieres estilizar los sábados aparte
              }
              return null;
            }}
          />
        </section>
      </form>
    </div>
  );
};
