import app from './app';
import dataSource from './config/data-source';

const PORT = process.env.PORT || 3000;

dataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(console.error);

