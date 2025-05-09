import Link from "next/link";

import { useState } from "react";
export default function Create() {
  const [activeIndex, setActiveIndex] = useState(1);
  const handleOnClick = (index) => {
    setActiveIndex(index);
  };
  return (
    <>
      <div className="wrapper-content-create">
        <div className="heading-section">
          <h2 className="tf-title pb-30">Create New File</h2>
        </div>
        <div className="widget-tabs relative">
          <ul className="widget-menu-tab">
            <li
              className={activeIndex === 1 ? "item-title active" : "item-title"}
              onClick={() => handleOnClick(1)}
            >
              <span className="inner">
                <span className="order">1</span> Upload your image{" "}
                <i className="icon-keyboard_arrow_right" />
              </span>
            </li>
            <li
              className={activeIndex === 2 ? "item-title active" : "item-title"}
              onClick={() => handleOnClick(2)}
            >
              <span className="inner">
                <span className="order">2</span>Description{" "}
                <i className="icon-keyboard_arrow_right" />
              </span>
            </li>
            <li
              className={activeIndex === 3 ? "item-title active" : "item-title"}
              onClick={() => handleOnClick(3)}
            >
              <span className="inner">
                <span className="order">3</span>Submit NFT
              </span>
            </li>
          </ul>
          <div className="widget-content-tab">
            <div
              className={
                activeIndex === 1
                  ? "widget-content-inner upload active"
                  : "widget-content-inner upload"
              }
              style={{ display: `${activeIndex == 1 ? "" : "none"}` }}
            >
              <div className="wrap-upload w-full">
                <form action="#">
                  <label className="uploadfile">
                    <img src="/assets/images/box-icon/upload.png" alt="" />
                    <h5>Upload file</h5>
                    <p className="text">Drag or choose your file to upload</p>
                    <div className="text filename">
                      PNG, GIF, WEBP, MP4 or MP3.Max 1Gb.
                    </div>
                    <input type="file" name="file" />
                  </label>
                </form>
              </div>
              <div className="wrap-content w-full">
                <form
                  id="commentform"
                  className="comment-form"
                  noValidate="novalidate"
                >
                  <fieldset className="name">
                    <label>Product name *</label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Product name"
                      name="name"
                      tabIndex={2}
                      aria-required="true"
                      required
                    />
                  </fieldset>
                  <fieldset className="message">
                    <label>Description *</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="Please describe your product*"
                      tabIndex={4}
                      aria-required="true"
                      required
                    />
                  </fieldset>
                  <div className="flex gap30">
                    <fieldset className="price">
                      <label>Price</label>
                      <input
                        type="text"
                        id="price"
                        placeholder="Price"
                        name="price"
                        tabIndex={2}
                        aria-required="true"
                        required
                      />
                    </fieldset>
                    <fieldset className="properties">
                      <label>Properties</label>
                      <input
                        type="text"
                        id="properties"
                        placeholder="Properties"
                        name="properties"
                        tabIndex={2}
                        aria-required="true"
                        required
                      />
                    </fieldset>
                    <fieldset className="size">
                      <label>Size</label>
                      <input
                        type="text"
                        id="size"
                        placeholder="Size"
                        name="size"
                        tabIndex={2}
                        aria-required="true"
                        required
                      />
                    </fieldset>
                  </div>
                  <fieldset className="blockchain">
                    <label>Blockchain</label>
                    <div className="widget-coins flex gap30 flex-wrap">
                      <div className="widget-coins-item flex items-center">
                        <img src="/assets/images/box-icon/coin-01.png" alt="" />
                        <p>
                          <Link href="#">Bitcoin</Link>
                        </p>
                      </div>
                      <div className="widget-coins-item flex items-center">
                        <img src="/assets/images/box-icon/coin-02.png" alt="" />
                        <p>
                          <Link href="#">Ethereum</Link>
                        </p>
                      </div>
                      <div className="widget-coins-item flex items-center">
                        <img src="/assets/images/box-icon/coin-03.png" alt="" />
                        <p>
                          <Link href="#">Cardano</Link>
                        </p>
                      </div>
                      <div className="widget-coins-item flex items-center">
                        <img src="/assets/images/box-icon/coin-04.png" alt="" />
                        <p>
                          <Link href="#">Solana</Link>
                        </p>
                      </div>
                      <div className="widget-coins-item flex items-center">
                        <img src="/assets/images/box-icon/coin-05.png" alt="" />
                        <p>
                          <Link href="#">Litecoin</Link>
                        </p>
                      </div>
                    </div>
                  </fieldset>
                  <fieldset className="collection">
                    <label>Collection</label>
                    <input
                      type="text"
                      id="collection"
                      placeholder="Collection"
                      name="collection"
                      tabIndex={2}
                      aria-required="true"
                      required
                    />
                  </fieldset>
                  <fieldset className="royatity">
                    <label>Royatity</label>
                    <input
                      type="text"
                      id="royatity"
                      placeholder="Royatity"
                      name="royatity"
                      tabIndex={2}
                      aria-required="true"
                      required
                    />
                  </fieldset>
                  <div className="btn-submit flex gap30 justify-center">
                    <button className="tf-button style-1 h50 w320 active">
                      Preview
                      <i className="icon-arrow-up-right2" />
                    </button>
                    <button
                      className="tf-button style-1 h50 w320"
                      type="submit"
                    >
                      Submit item
                      <i className="icon-arrow-up-right2" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div
              className={
                activeIndex === 2
                  ? "widget-content-inner description active"
                  : "widget-content-inner description"
              }
              style={{ display: `${activeIndex == 2 ? "" : "none"}` }}
            >
              <div className="wrap-upload">
                <form action="#" className="h-full">
                  <label className="uploadfile h-full flex items-center justify-center">
                    <div className="text-center">
                      <img src="/assets/images/box-icon/upload.png" alt="" />
                      <h5>Upload file</h5>
                      <p className="text">Drag or choose your file to upload</p>
                      <div className="text filename">
                        PNG, GIF, WEBP, MP4 or MP3.Max 1Gb.
                      </div>
                      <input type="file" name="file" />
                    </div>
                  </label>
                </form>
              </div>
              <div className="wrap-content w-full">
                <form
                  id="commentform"
                  className="comment-form"
                  noValidate="novalidate"
                >
                  <fieldset className="name">
                    <label>Product name *</label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Product name"
                      name="name"
                      tabIndex={2}
                      aria-required="true"
                      required
                    />
                  </fieldset>
                  <fieldset className="message">
                    <label>Description *</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="Please describe your product*"
                      tabIndex={4}
                      aria-required="true"
                      required
                    />
                  </fieldset>
                  <div className="flex gap30">
                    <fieldset className="price">
                      <label>Price</label>
                      <input
                        type="text"
                        id="price"
                        placeholder="Price"
                        name="price"
                        tabIndex={2}
                        aria-required="true"
                        required
                      />
                    </fieldset>
                    <fieldset className="properties">
                      <label>Properties</label>
                      <input
                        type="text"
                        id="properties"
                        placeholder="Properties"
                        name="properties"
                        tabIndex={2}
                        aria-required="true"
                        required
                      />
                    </fieldset>
                    <fieldset className="size">
                      <label>Size</label>
                      <input
                        type="text"
                        id="size"
                        placeholder="Size"
                        name="size"
                        tabIndex={2}
                        aria-required="true"
                        required
                      />
                    </fieldset>
                  </div>
                  <fieldset className="blockchain">
                    <label>Blockchain</label>
                    <div className="widget-coins flex gap30 flex-wrap">
                      <div className="widget-coins-item flex items-center">
                        <img src="/assets/images/box-icon/coin-01.png" alt="" />
                        <p>
                          <Link href="#">Bitcoin</Link>
                        </p>
                      </div>
                      <div className="widget-coins-item flex items-center">
                        <img src="/assets/images/box-icon/coin-02.png" alt="" />
                        <p>
                          <Link href="#">Ethereum</Link>
                        </p>
                      </div>
                      <div className="widget-coins-item flex items-center">
                        <img src="/assets/images/box-icon/coin-03.png" alt="" />
                        <p>
                          <Link href="#">Cardano</Link>
                        </p>
                      </div>
                      <div className="widget-coins-item flex items-center">
                        <img src="/assets/images/box-icon/coin-04.png" alt="" />
                        <p>
                          <Link href="#">Solana</Link>
                        </p>
                      </div>
                      <div className="widget-coins-item flex items-center">
                        <img src="/assets/images/box-icon/coin-05.png" alt="" />
                        <p>
                          <Link href="#">Litecoin</Link>
                        </p>
                      </div>
                    </div>
                  </fieldset>
                  <fieldset className="collection">
                    <label>Collection</label>
                    <input
                      type="text"
                      id="collection"
                      placeholder="Collection"
                      name="collection"
                      tabIndex={2}
                      aria-required="true"
                      required
                    />
                  </fieldset>
                  <fieldset className="royatity">
                    <label>Royatity</label>
                    <input
                      type="text"
                      id="royatity"
                      placeholder="Royatity"
                      name="royatity"
                      tabIndex={2}
                      aria-required="true"
                      required
                    />
                  </fieldset>
                  <div className="btn-submit flex gap30 justify-center">
                    <button className="tf-button style-1 h50 active">
                      Preview
                      <i className="icon-arrow-up-right2" />
                    </button>
                    <button className="tf-button style-1 h50" type="submit">
                      Submit item
                      <i className="icon-arrow-up-right2" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div
              className={
                activeIndex === 3
                  ? "widget-content-inner submit active"
                  : "widget-content-inner submit"
              }
              style={{ display: `${activeIndex == 3 ? "" : "none"}` }}
            >
              <div className="wrap-upload w-full">
                <form action="#">
                  <label className="uploadfile">
                    <img src="/assets/images/box-icon/upload.png" alt="" />
                    <h5>Upload file</h5>
                    <p className="text">Drag or choose your file to upload</p>
                    <div className="text filename">
                      PNG, GIF, WEBP, MP4 or MP3.Max 1Gb.
                    </div>
                    <input type="file" name="file" />
                  </label>
                </form>
              </div>
              <div className="wrap-content w-full">
                <form
                  id="commentform"
                  className="comment-form"
                  noValidate="novalidate"
                >
                  <fieldset className="name">
                    <label>Product name *</label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Product name"
                      name="name"
                      tabIndex={2}
                      aria-required="true"
                      required
                    />
                  </fieldset>
                  <fieldset className="message">
                    <label>Description *</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="Please describe your product*"
                      tabIndex={4}
                      aria-required="true"
                      required
                    />
                  </fieldset>
                  <div className="flex gap30">
                    <fieldset className="price">
                      <label>Price</label>
                      <input
                        type="text"
                        id="price"
                        placeholder="Price"
                        name="price"
                        tabIndex={2}
                        aria-required="true"
                        required
                      />
                    </fieldset>
                    <fieldset className="properties">
                      <label>Properties</label>
                      <input
                        type="text"
                        id="properties"
                        placeholder="Properties"
                        name="properties"
                        tabIndex={2}
                        aria-required="true"
                        required
                      />
                    </fieldset>
                    <fieldset className="size">
                      <label>Size</label>
                      <input
                        type="text"
                        id="size"
                        placeholder="Size"
                        name="size"
                        tabIndex={2}
                        aria-required="true"
                        required
                      />
                    </fieldset>
                  </div>
                  <fieldset className="blockchain">
                    <label>Blockchain</label>
                    <div className="widget-coins flex gap30 flex-wrap">
                      <div className="widget-coins-item flex items-center">
                        <img src="/assets/images/box-icon/coin-01.png" alt="" />
                        <p>
                          <Link href="#">Bitcoin</Link>
                        </p>
                      </div>
                      <div className="widget-coins-item flex items-center">
                        <img src="/assets/images/box-icon/coin-02.png" alt="" />
                        <p>
                          <Link href="#">Ethereum</Link>
                        </p>
                      </div>
                      <div className="widget-coins-item flex items-center">
                        <img src="/assets/images/box-icon/coin-03.png" alt="" />
                        <p>
                          <Link href="#">Cardano</Link>
                        </p>
                      </div>
                      <div className="widget-coins-item flex items-center">
                        <img src="/assets/images/box-icon/coin-04.png" alt="" />
                        <p>
                          <Link href="#">Solana</Link>
                        </p>
                      </div>
                      <div className="widget-coins-item flex items-center">
                        <img src="/assets/images/box-icon/coin-05.png" alt="" />
                        <p>
                          <Link href="#">Litecoin</Link>
                        </p>
                      </div>
                    </div>
                  </fieldset>
                  <fieldset className="collection">
                    <label>Collection</label>
                    <input
                      type="text"
                      id="collection"
                      placeholder="Collection"
                      name="collection"
                      tabIndex={2}
                      aria-required="true"
                      required
                    />
                  </fieldset>
                  <fieldset className="royatity">
                    <label>Royatity</label>
                    <input
                      type="text"
                      id="royatity"
                      placeholder="Royatity"
                      name="royatity"
                      tabIndex={2}
                      aria-required="true"
                      required
                    />
                  </fieldset>
                  <div className="btn-submit flex gap30 justify-center">
                    <button className="tf-button style-1 h50 w320 active">
                      Preview
                      <i className="icon-arrow-up-right2" />
                    </button>
                    <button
                      className="tf-button style-1 h50 w320"
                      type="submit"
                    >
                      Submit item
                      <i className="icon-arrow-up-right2" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
