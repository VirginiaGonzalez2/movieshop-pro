import DealOfTheDayClient from "./DealOfTheDayClient";
import { getDealMovie } from "@/actions/deal-of-the-day";

export default async function DealOfTheDayWidget() {
    const deal = await getDealMovie();
    return <DealOfTheDayClient deal={deal} />;
}
