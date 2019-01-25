from deadWeb.dead import APP
from config import debug

if __name__ == "__main__":
    APP.run(debug=debug.DEBUG, host=debug.HOST, port=debug.PORT)
