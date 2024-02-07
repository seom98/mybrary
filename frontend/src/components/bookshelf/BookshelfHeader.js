import title from "../atom/atomstyle/Title.module.css";
import { useNavigate } from "react-router-dom";

//책장 페이지 헤더
export default function BookshelfHeader() {
  const navigate = useNavigate();
  return (
    <div>
      <div>
        <div className={title.back} onClick={() => navigate("../")}>
          &lt; 뒤로가기
        </div>
      </div>
      <div className={title.title}>
        <div
          className={title.left_title}
          onClick={() => navigate("../threads")}
        >
          &lt; 게시물
        </div>
        <div className={title.main_title}>cwnsgh's bookshelf</div>
        <div
          className={title.right_title}
          onClick={() => navigate("../rollingpaper")}
        >
          {" "}
          롤링페이퍼 &gt;
        </div>
      </div>
    </div>
  );
}