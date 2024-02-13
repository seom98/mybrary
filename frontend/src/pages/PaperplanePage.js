import Container from "../components/frame/Container";
import SharedPaper from "../components/paperplane/SharedPaper";
import styles from "./style/PaperplanePage.module.css";
import 종이비행기 from "../assets/종이비행기.png";
import { useEffect, useState, useRef } from "react";
import useUserStore from "../store/useUserStore";
import { getChatList, getMessageList } from "../api/chat/Chat.js";
import ChatProfile from "../components/paperplane/ChatProfile.js";
import Iconuser2 from "../assets/icon/Iconuser2.png";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useNavigate } from "react-router-dom";

export default function PaperplanePage() {
  /* 웹소켓: 채팅용 주소를 구독 */
  const user = useUserStore((state) => state.user);
  const [chatRoomList, setChatRoomList] = useState([]); // 채팅방 리스트
  const [chatMessageList, setChatMessageList] = useState([]); // 접속중인 채팅방 채팅 내역
  const [nowChatRoom, setNowChatRoom] = useState(null); // 현재 내가 보고있는 채팅방 정보
  const [stompClient, setStompClient] = useState(null);
  const [nowMessage, setNowMessage] = useState("");
  const chatContainerRef = useRef(null); // 채팅 컨테이너에 대한 ref 스크롤 아래로 관리하기 윟마
  const navigate = useNavigate();

  //채팅페이지에 들어오면 구독 실행
  useEffect(() => {
    (async function asyncGetChatList() {
      const res = await getChatList();
      setChatRoomList(res.data.content);
    })();

    if (!stompClient) {
      const token = localStorage.getItem("accessToken");
      const client = new Client({
        webSocketFactory: () => new SockJS("https://i10b207.p.ssafy.io/ws"),
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      client.onConnect = function () {
        console.log("채팅구독");
        client.subscribe(`sub/chatMemberId/${user.memberId}`, (message) => {
          const res = JSON.body(message.body);
          setChatMessageList((prev) => [res, ...prev]);
        });
      };

      client.activate();
      setStompClient(client);
    }
  }, []);

  useEffect(() => {
    if (nowChatRoom) {
      (async function asyncGetMessageList() {
        const res = await getMessageList(nowChatRoom.chatRoomId);
        setChatMessageList(res.data.content);
      })();
    }

    const scrollToBottom = () => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    };

    scrollToBottom(); // 컴포넌트 마운트 시 실행
    //console.log(nowChatRoom);
  }, [nowChatRoom]);

  useEffect(() => {
    // 채팅 메시지 컨테이너의 스크롤을 맨 아래로 이동
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessageList]); // chatMessageList가 변경될 때마다 실행

  const sendMessage = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // 기본 이벤트(여기서는 줄바꿈)를 방지
      // 메시지 전송 로직

      if (nowMessage.trim() !== "") {
        const messageObject = {
          chatRoomId: nowChatRoom.chatRoomId,
          senderId: user.memberId,
          message: nowMessage,
          threadId: 1,
        };
        const destination = `/pub/chat/${nowChatRoom.chatRoomId}/send`;
        const bodyData = JSON.stringify(messageObject);
        stompClient.publish({ destination, body: bodyData });

        const message = {
          chatRoomId: nowChatRoom.chatRoomId,
          senderId: user.memberId,
          nickname: user.nickname,
          content: nowMessage,
          profileImageUrl: user.profileImageUrl,
          timestamp: nowChatRoom,
        };
        setChatMessageList((prev) => [message, ...prev]);

        const scrollToBottom = () => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
              chatContainerRef.current.scrollHeight;
          }
        };

        setTimeout(() => scrollToBottom(), 10);
      }

      setNowMessage(""); // 메시지 전송 후 입력 필드 초기화
    }
  };

  const handleSelectChatRoom = (chatRoom) => {
    setNowChatRoom(chatRoom);
  };

  return (
    <>
      <Container backgroundColor={"#FFFAFA"}>
        <div className={styles.main}>
          <div className={styles.pipibox}>
            <div className={styles.member}>
              <div className={styles.pipi}>Paper Plane</div>
              <div className={styles.search}>
                <>
                  <form action="/search" method="get" style={{ width: "100%" }}>
                    <label htmlFor="search"></label>
                    <div className={styles.searchContainer}>
                      <button type="submit" className={styles.searchButton}>
                        검색
                      </button>
                      <input
                        type="text"
                        id="search"
                        name="q"
                        placeholder=""
                        className={styles.searchInput}
                      />
                    </div>
                  </form>
                </>
              </div>
              <div className={styles.users} style={{ marginTop: "15px" }}>
                {chatRoomList.length > 0 ? (
                  <>
                    {chatRoomList.map((chatRoom) => (
                      <ChatProfile
                        key={chatRoom.chatRoomId}
                        isSelected={
                          chatRoom.chatRoomId === nowChatRoom?.chatRoomId
                        }
                        onClick={() => handleSelectChatRoom(chatRoom)}
                        otherMemberNickname={chatRoom.otherMemberNickname}
                        otherMemberProfileImageUrl={
                          chatRoom.otherMemberProfileImageUrl
                        }
                        latestMessage={chatRoom.latestMessage}
                        unreadMessageCount={chatRoom.unreadMessageCount}
                      />
                    ))}
                  </>
                ) : (
                  <div className={styles.emptyList}>
                    검색해서, 새로운채팅을 시작해보세요 !
                  </div>
                )}
              </div>
            </div>
            <div className={styles.gori}>
              <div className={styles.ring}></div>
              <div className={styles.ring}></div>
              <div className={styles.ring}></div>
              <div className={styles.ring}></div>
              <div className={styles.ring}></div>
              <div className={styles.ring}></div>
              <div className={styles.ring}></div>
            </div>
            <div className={styles.chat}>
              {/* 채팅 헤더 및 마이브러리 가기 버튼 */}
              {nowChatRoom ? (
                <div>
                  <div className={styles.header}>
                    {/* 상대방 프로필 이미지와 닉네임 */}
                    <div className={styles.이미지닉네임}>
                      <img
                        src={
                          nowChatRoom.otherMemberProfileImageUrl
                            ? `https://jingu.s3.ap-northeast-2.amazonaws.com/${nowChatRoom.otherMemberProfileImageUrl}`
                            : Iconuser2
                        } // 선택된 이미지 또는 기본 이미지
                        alt="프로필"
                        style={{
                          width: "23%",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                      <div>{nowChatRoom.otherMemberNickname}</div>
                    </div>
                    <button
                      className={styles.마이브러리가기}
                      onClick={() => {
                        navigate(`/mybrary/${nowChatRoom.otherMemberId}`);
                      }}
                    >
                      마이브러리 가기
                    </button>
                  </div>
                  {/* 채팅 메시지 내용 */}
                  <div className={styles.middle}>
                    <div className={styles.textmain}>
                      <div
                        className={styles.chatContainer}
                        ref={chatContainerRef}
                      >
                        {chatMessageList
                          .slice()
                          .reverse()
                          .map((message, index) => (
                            <div
                              className={`${styles.message} ${
                                message.senderId === user.memberId
                                  ? styles.sender
                                  : styles.receiver
                              }`}
                              key={index}
                            >
                              {message.content}
                            </div>
                          ))}

                        {/* <SharedPaper /> */}
                      </div>
                    </div>
                    {/* 메시지 입력창 */}
                    <div className={styles.sendbox}>
                      <textarea
                        placeholder="메시지를 보내세요"
                        rows="1" // 초기에 표시할 줄의 수
                        style={{
                          flexGrow: 1,
                          marginLeft: "10px",
                          marginRight: "10px",
                          padding: "10px",
                          borderRadius: "20px",
                          border: "none",
                          outline: "none",
                          backgroundColor: "#eee3dd", // 배경색을 디자인에 맞게 조정
                          color: "#57423f", // 글자 색상 조정
                          fontSize: "16px", // 글자 크기 조정
                          resize: "none", // 사용자가 크기 조절하지 못하도록 설정
                          overflow: "auto", // 내용이 넘칠 때 스크롤바 자동 생성
                        }}
                        value={nowMessage}
                        onChange={(e) => setNowMessage(e.target.value)}
                        onKeyDown={sendMessage}
                      />

                      <img
                        className={styles.종이비행기이미지}
                        src={종이비행기}
                        style={{
                          width: "60px",
                          objectFit: "contain",
                          marginRight: "15px",
                          cursor: "pointer",
                        }}
                        alt="전송버튼"
                        onClick={sendMessage}
                      ></img>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.채팅방이없어요}>
                  <div>Paper Plane</div>
                  <img
                    className={styles.종이비행기이미지}
                    src={종이비행기}
                    alt=""
                  />
                  <div>팔로우하고있는 사람에게 종이비행기를 날려보세요.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
