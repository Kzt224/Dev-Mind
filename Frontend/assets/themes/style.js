import { Colors } from "../mainColor/colors"



export const shadowStyles = {
  "containerStyle": {
    "boxShadow": "  0 2px 2px rgba(0,0,0,0.6)",
    "borderRadius": 10
  },
  "borderWidth": {
    "sm": 2,
    "md": 3,
    "lg": 6
  }
}

export const customCard = {
  get cardNormal() {
    return {
      borderRadius: 14,
      borderWidth: 1,
      borderColor: Colors.gray,
    };
  }
};
export const dvmBtn = {
  btnPrimary: {
    width: 100,
    height: 40,
    backgroundColor: Colors.primary,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  btnDisable: {
    width: 100,
    height: 40,
    backgroundColor: Colors.gray,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.6,
  },
  btnWhite: {
    borderRadius: 15,
    width: 100,
    height: 40,
    backgroundColor: Colors.gray,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  }
}