<div class="spinner"></div>

<style>
  .spinner {
    display: inline-block;
    width: 150px;
    height: 150px;
    border: 6px solid theme('colors.slate.600 / 0.35');
    border-radius: 50%;
    border-top-color: theme('colors.slate.600 / 0.9');
    animation: spin 1s ease-in-out infinite;
    -webkit-animation: spin 1s ease-in-out infinite;
  }

  @keyframes spin {
    to { -webkit-transform: rotate(360deg); }
  }

  @-webkit-keyframes spin {
    to { -webkit-transform: rotate(360deg); }
  }
</style>
