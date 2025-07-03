import Car from "../../../components/Car";

export default function CarPage({ params }) {
  const { id } = params;

  return <Car id={id} />;
}
