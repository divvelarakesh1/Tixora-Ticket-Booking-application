
DROP FUNCTION IF EXISTS isPresent;
DROP PROCEDURE IF EXISTS BOOK;
DROP PROCEDURE IF EXISTS CANCEL;
DROP PROCEDURE IF EXISTS insert_transaction;
DROP PROCEdURE IF EXISTS CreateIndexIfNotExists;
DROP TRIGGER IF EXISTS after_booking_cancel;
CREATE FUNCTION isPresent(t VARCHAR(10))
RETURNS TINYINT(1) DETERMINISTIC
BEGIN 
    DECLARE Present TINYINT(1);
    SELECT EXISTS(
        SELECT 1 FROM USERS WHERE USERNAME = t
    ) INTO Present;
    RETURN Present;
END;
CREATE PROCEDURE BOOK(
    IN uname VARCHAR(30),
    IN c_id VARCHAR(30),
    IN b_id VARCHAR(30),
    IN e_id VARCHAR(30),
    IN DIR VARCHAR(100),
    IN seat_count INT
)
BEGIN
    DECLARE a INT;  
    DECLARE b INT;  
    DECLARE c INT;  

    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    START TRANSACTION;

    SELECT COUNT(*) INTO a
    FROM CLASS
    WHERE CLASS_ID = c_id AND EVENT_ID = e_id;

    IF a > 0 THEN
        SELECT COST INTO c
        FROM CLASS
        WHERE CLASS_ID = c_id AND EVENT_ID = e_id;

        SET c = c * seat_count;

        SELECT TOTAL_SEATS_AVAILABLE INTO b
        FROM CLASS
        WHERE CLASS_ID = c_id AND EVENT_ID = e_id;

        IF b IS NOT NULL AND b >= seat_count THEN
            UPDATE CLASS
            SET TOTAL_SEATS_AVAILABLE = TOTAL_SEATS_AVAILABLE - seat_count
            WHERE CLASS_ID = c_id AND EVENT_ID = e_id;

            INSERT INTO BOOKINGS (
                USERNAME,
                BOOKING_ID,
                EVENT_ID,
                TICKET_COUNT,
                TICKETS_VALUE,
                STATUS,
                CLASS_ID,
                DATE_AND_TIME
            ) VALUES (uname, b_id, e_id, seat_count, c,1,c_id, NOW());
            INSERT INTO TRANSACTION_DETAILS(
                TRANSACTION_ID,
                BOOKING_ID,
                AMOUNT_PAID,
                STATUS,
                DIRECTION,
                TRANSACTION_TIMESTAMP
            )VALUES(CONCAT(b_id, '0'),b_id,c,1,DIR,NOW());
        END IF;
    END IF;

    COMMIT;
END;
CREATE PROCEDURE CreateIndexIfNotExists()
BEGIN
    DECLARE index1_exists INT DEFAULT 0;
    DECLARE index2_exists INT DEFAULT 0;
    DECLARE index3_exists INT DEFAULT 0;
    DECLARE index4_exists INT DEFAULT 0;
    SELECT COUNT(*) INTO index1_exists 
    FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'BOOKINGS' 
    AND INDEX_NAME = 'idx_b_id';
    SELECT COUNT(*) INTO index2_exists 
    FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'EVENTS' 
    AND INDEX_NAME = 'idx_e_id';
    SELECT COUNT(*) INTO index3_exists 
    FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'USERS' 
    AND INDEX_NAME = 'idx_u_id';
    SELECT COUNT(*) INTO index4_exists 
    FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'CLASS' 
    AND INDEX_NAME = 'idx_c_id';
    IF index1_exists = 0 THEN
        SET @sql = 'CREATE INDEX idx_b_id ON BOOKINGS(BOOKING_ID)';
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
    IF index2_exists = 0 THEN
        SET @sql = 'CREATE INDEX idx_e_id ON EVENTS(EVENT_ID)';
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
    IF index3_exists = 0 THEN
        SET @sql = 'CREATE INDEX idx_u_id ON USERS(USER_NAME)';
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;

END;
CREATE PROCEDURE CANCEL(in BOOK_id VARCHAR(30))
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    START TRANSACTION;
   UPDATE BOOKINGS 
    SET status =0
    WHERE BOOKING_ID = BOOK_id;
    COMMIT;

END;
CREATE TRIGGER after_booking_cancel
AFTER UPDATE ON BOOKINGS
FOR EACH ROW
BEGIN
    IF OLD.STATUS != 0 AND NEW.STATUS = 0 THEN
        UPDATE CLASS
        SET TOTAL_SEATS_AVAILABLE = TOTAL_SEATS_AVAILABLE + OLD.TICKET_COUNT
        WHERE CLASS_ID = OLD.CLASS_ID;
    END IF;
END;
CREATE PROCEDURE insert_transaction(
    IN tr_id VARCHAR(30),
    IN b_id VARCHAR(30),
    IN payment_amount VARCHAR(30),
    IN stat VARCHAR(30),
    IN PAYMENT_STAT VARCHAR(30)
)
BEGIN 
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK; 
    END;

    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    START TRANSACTION;
    INSERT INTO TRANSACTION_DETAILS
    VALUES (tr_id, b_id, payment_amount, stat, PAYMENT_STAT, NOW());
    
    COMMIT;
END 
-- create procedure cancel(
--     IN book_id varchar(30)
-- )
-- BEGIN
--     SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
--     START TRANSACTION;
--     UPDATE BOOKINGS
--     SET STAT =0
--     WHERE BOOKING_ID=book_id;
--     UPDATE BOOKINGS NATURAL JOIN CLASS
--     SET CLASS.TOTAL_SEATS_AVAILABLE = CLASS.TOTAL_SEATS_AVAILABLE + BOOKINGS.TICKET_COUNT
--     WHERE CLASS.BOOKING_ID=book_id;
--     COMMIT;
-- END;
-- create procedure your_tickets(
--     IN uname VARCHAR(30)
-- )
-- BEGIN
--     SELECT *
--     FROM BOOKINGS
--     WHERE USERNAME=uname;
-- END
