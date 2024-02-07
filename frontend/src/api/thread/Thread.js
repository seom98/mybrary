import axios from "axios";

/* 쓰레드 생성 */
export async function createThread(object) {
  try {
    const response = await axios.post("/api/vi/thread", object);
    return response.data;
  } catch (error) {
    throw error;
  }
}

/* 쓰레드 수정 */
export async function updateThread(object) {
  try {
    const response = await axios.put("/api/vi/thread", object);
    return response.data;
  } catch (error) {
    throw error;
  }
}

/* 쓰레드 단건 조회 */
export async function getThread(threadid) {
  try {
    const response = await axios.get(`/api/vi/thread/${threadid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

/* 쓰레드 삭제 */
export async function deleteThread(threadid) {
  try {
    const response = await axios.delete(`/api/vi/thread/${threadid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

/* 특정 회원의 쓰레드(나의게시물) 조회 */
export async function getDeskThread(memberid, pagingObject) {
  try {
    const response = await axios.get(`/api/vi/thread/${memberid}/desk`, {
      pagingObject,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

/* 메인피드 쓰레드 조회 */
export async function getThreadList(pagingObject) {
  try {
    const response = await axios.get(`/api/vi/thread/home`, {
      pagingObject,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

/* 나의 쓰레드 조회 */
export async function getMyThreadList(pagingObject) {
  try {
    const response = await axios.get(`/api/vi/thread/desk`, {
      pagingObject,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}