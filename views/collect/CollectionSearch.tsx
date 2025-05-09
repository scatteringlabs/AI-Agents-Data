export default function CollectionSearch() {
  return (
    <form
      action="#"
      method="get"
      role="search"
      className="search-form relative tw-w-full"
    >
      <input
        type="search"
        id="search"
        className="search-field style-1"
        // 覆盖模板里的样式
        style={{ borderRadius: "9999px", minWidth: "250px" }}
        placeholder="Search item ID or traits"
        name="s"
        title="Search for"
        required
      />
      <button className="search search-submit" type="submit" title="Search">
        <i className="icon-search" />
      </button>
    </form>
  );
}
