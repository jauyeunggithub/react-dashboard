import React from "react";
import { useForm } from "react-hook-form";

const FormWidget = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="widget">
      <div className="widget-title">Form Widget</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Name</label>
          <input {...register("name", { required: "Name is required" })} />
          {errors.name && <span>{errors.name.message}</span>}
        </div>
        <div>
          <label>Email</label>
          <input {...register("email", { required: "Email is required" })} />
          {errors.email && <span>{errors.email.message}</span>}
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default FormWidget;
