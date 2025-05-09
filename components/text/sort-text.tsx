import SortIconButton from "../button/sort-icon-button";

interface iSortText {
  title: string;
}
const SortText = ({ title }: iSortText) => {
  return <SortIconButton title={title} />;
};

export default SortText;
