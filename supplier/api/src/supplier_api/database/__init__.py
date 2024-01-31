from arango import ArangoClient
from arango.database import StandardDatabase

from ..constants import ARANGO_DB, ARANGO_HOST, ARANGO_SECURE, ARANGO_PORT, ARANGO_PW, ARANGO_USERNAME


class Database():

    __client: ArangoClient = None
    _db: StandardDatabase = None

    def __init__(self) -> None:
        if self.__client is None:
            self.__client = ArangoClient(hosts=f'http{"s" if ARANGO_SECURE else ""}://{ARANGO_HOST}:{ARANGO_PORT}')
        if self._db is None:
            self._db = self.__client.db(ARANGO_DB, username=ARANGO_USERNAME, password=ARANGO_PW)

    @property
    def db(self) -> StandardDatabase:
        return self._db
