import redis

def reset_active_users():
    r = redis.Redis(host='localhost', port=6379, db=1)
    keys = r.keys("active_users:*")
    for key in keys:
        r.set(key, 0)

if __name__ == "__main__":
    reset_active_users()
