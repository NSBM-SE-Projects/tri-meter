-- Stored Procedure: Record a payment and update bill status
CREATE PROCEDURE sp_process_payment
  @BillId INT,
  @Amount DECIMAL(10,2),
  @PaymentDate DATE,
  @Method VARCHAR(50),
  @Reference VARCHAR(100) = NULL
AS
BEGIN
  SET NOCOUNT ON;

  BEGIN TRY
    BEGIN TRANSACTION;

    -- Validate bill exists
    IF NOT EXISTS (SELECT 1 FROM Bill WHERE B_ID = @BillId)
    BEGIN
      RAISERROR('Bill not found', 16, 1);
      RETURN;
    END;

    -- Insert payment record
    INSERT INTO Payment (B_ID, P_Amount, P_Date, P_Method, P_Reference)
    VALUES (@BillId, @Amount, @PaymentDate, @Method, @Reference);

    -- Calculate total paid for this bill
    DECLARE @TotalPaid DECIMAL(10,2) = (
      SELECT SUM(P_Amount) FROM Payment WHERE B_ID = @BillId
    );

    DECLARE @BillAmount DECIMAL(10,2) = (
      SELECT B_TotalAmount FROM Bill WHERE B_ID = @BillId
    );

    -- Update bill status
    UPDATE Bill
    SET B_Status = CASE
      WHEN @TotalPaid >= @BillAmount THEN 'Paid'
      WHEN @TotalPaid > 0 THEN 'Partially Paid'
      ELSE 'Unpaid'
    END
    WHERE B_ID = @BillId;

    COMMIT TRANSACTION;

    SELECT 'Success' as Status, @TotalPaid as TotalPaid, @BillAmount as BillAmount;
  END TRY
  BEGIN CATCH
    IF @@TRANCOUNT > 0
      ROLLBACK TRANSACTION;

    SELECT 'Error' as Status, ERROR_MESSAGE() as ErrorMsg;
  END CATCH;
END;
GO
