import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../store/userSlice";
export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.user.userType === "EMPLOYEE") {
        navigate("/admin");
      } else if (user.user.userType === "CUSTOMER") {
        navigate("/");
      }
    }
  }, [user, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8081/api/auth/login",
        {
          email,
          password,
        }
      );

      const data = response.data;
      console.log(data);

      if (data && data.user && data.user.userType) {
        dispatch(setUser(data));
        alert("Đăng nhập thành công!");

        if (data.user.userType === "EMPLOYEE") {
          navigate("/admin");
        } else if (data.user.userType === "CUSTOMER") {
          navigate("/");
        }
      } else {
        alert("Sai tài khoản hoặc mật khẩu.");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-semibold text-center mb-4">Đăng nhập</h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label className="mb-2 text-sm font-medium">Email</label>
          <input
            type="email"
            className="border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="mb-2 text-sm font-medium">Mật khẩu</label>
          <input
            type="password"
            className="border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};
