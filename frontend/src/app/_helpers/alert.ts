import Swal from "sweetalert2";

export function err_msg(msg, title = 'Error!') {
  Swal.fire({
    title: title,
    text: msg,
    icon: "error",
    showCancelButton: false,
    confirmButtonColor: "#163862",
    confirmButtonText: "Ok"
  });
}

export function success_msg(msg, title = 'Success!') {
  Swal.fire({
    title: title,
    text: msg,
    icon: "success",
    showCancelButton: false,
    confirmButtonColor: "#c3e6cb",
    confirmButtonText: "Ok"
  });
}
