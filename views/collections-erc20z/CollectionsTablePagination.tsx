import Link from "next/link";

const CollectionsTablePagination = () => {
  return (
    <div className="widget-pagination">
      <ul className="justify-center">
        <li>
          <Link href="#">
            <i className="icon-keyboard_arrow_left" />
          </Link>
        </li>
        <li>
          <Link href="#">1</Link>
        </li>
        <li>
          <Link href="#">2</Link>
        </li>
        <li className="active">
          <Link href="#">3</Link>
        </li>
        <li>
          <Link href="#">4</Link>
        </li>
        <li>
          <Link href="#">...</Link>
        </li>
        <li>
          <Link href="#">
            <i className="icon-keyboard_arrow_right" />
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default CollectionsTablePagination;
